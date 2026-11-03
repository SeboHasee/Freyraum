import assert from 'node:assert/strict';
import { buildSync } from 'esbuild';

class Element extends EventTarget {
  constructor() {
    super();
    this.dataset = {};
    this.children = [];
    this.attributes = new Map();
    this.classes = new Set();
    this.classList = {
      add: (...names) => names.forEach((name) => this.classes.add(name)),
      remove: (...names) => names.forEach((name) => this.classes.delete(name)),
      contains: (name) => this.classes.has(name),
    };
  }
  appendChild(child) { this.children.push(child); child.parentElement = this; }
  after(child) { this.parentElement?.appendChild(child); }
  remove() { this.parentElement = null; }
  setAttribute(name, value) { this.attributes.set(name, value); }
  contains(child) { return child === this || this.children.some((node) => node.contains(child)); }
  focus() { document.activeElement = this; this.dispatchEvent(new Event('focus')); }
  querySelector() { return this.children[0] ?? null; }
  getBoundingClientRect() { this.reads = (this.reads ?? 0) + 1; return this.rect; }
}

const timers = new Map();
let timerId = 0;
const media = new EventTarget();
media.matches = true;
globalThis.window = Object.assign(new EventTarget(), {
  innerHeight: 900,
  matchMedia: () => media,
  setTimeout: (callback, delay) => { timers.set(++timerId, { callback, delay }); return timerId; },
});
globalThis.setTimeout = window.setTimeout;
globalThis.clearTimeout = (id) => timers.delete(id);
globalThis.requestAnimationFrame = (callback) => { callback(); return 1; };
globalThis.document = Object.assign(new EventTarget(), {
  documentElement: new Element(),
  createElement: () => new Element(),
  activeElement: null,
  modal: false,
  querySelector: () => document.modal ? new Element() : null,
});
globalThis.ResizeObserver = class {
  observe() {}
  disconnect() { this.disconnected = true; }
};

const result = buildSync({
  entryPoints: ['src/ui/ChromeVisibilityManager.ts'],
  bundle: true, format: 'esm', platform: 'browser', write: false,
});
const { ChromeVisibilityManager } = await import(
  `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`
);
const prefs = {
  current: { alwaysShowChrome: false },
  subscribe(callback) { this.callback = callback; return () => { this.callback = null; }; },
};
const root = new Element();
const timeline = new Element();
timeline.rect = { top: 730, left: 100, right: 1100 };
root.appendChild(timeline);
const manager = new ChromeVisibilityManager(new Element(), prefs, root);
manager.init();
const cue = manager.registerTimeline(timeline);
const shown = () => timeline.classList.contains('is-revealed');
const pointer = (type, x, y, extra = {}) => {
  const event = new Event(type);
  Object.assign(event, { pointerType: 'mouse', clientX: x, clientY: y, buttons: 0, ...extra });
  window.dispatchEvent(event);
};
const escape = () => {
  const event = new Event('keydown', { cancelable: true });
  event.key = 'Escape';
  document.dispatchEvent(event);
  return event.defaultPrevented;
};
const expire = () => {
  const pending = [...timers.values()];
  timers.clear();
  pending.forEach(({ callback }) => callback());
};
assert.equal(timeline.hidden, true, 'loading/hub timeline hidden');
assert.equal(cue.hidden, true, 'loading/hub cue hidden');
manager.setTimelineAvailable(true);
assert.equal(shown(), false, 'fine mouse starts clean');
assert.equal(cue.textContent, 'Werke');
assert.equal(cue.attributes.get('aria-controls'), 'freyraum-timeline');
const measured = timeline.reads;
pointer('pointermove', 500, 699);
assert.equal(shown(), true, 'measured bar plus 32px upper margin reveals');
pointer('pointermove', 500, 899);
assert.equal(shown(), true, 'bottom gap is part of proximity zone');
prefs.callback();
assert.equal(shown(), true, 'unrelated preference updates preserve proximity reveal');
assert.equal(timeline.reads, measured, 'pointer movement never reads layout');
pointer('pointermove', 500, 200);
assert.equal([...timers.values()].some(({ delay }) => delay === 1000), true, 'one second grace');
assert.equal(shown(), true, 'grace does not immediately hide');
pointer('pointermove', 500, 800);
expire();
assert.equal(shown(), true, 'reentry cancels stale hide');
pointer('pointermove', 500, 200);
timeline.dispatchEvent(new Event('pointerenter'));
expire();
assert.equal(shown(), true, 'timer rechecks active hover');
timeline.dispatchEvent(new Event('pointerleave'));
expire();
assert.equal(shown(), false, 'leaving zone and panel hides');
pointer('pointerdown', 500, 200);
pointer('pointermove', 500, 800, { buttons: 1 });
assert.equal(shown(), false, 'artwork drag cannot reveal');
pointer('pointerup', 500, 800);
assert.equal(shown(), false, 'drag release alone does not reveal');
pointer('pointermove', 500, 800);
assert.equal(shown(), true);
assert.equal(escape(), true, 'timeline dismissal consumes Escape before gallery back-navigation');
assert.equal(shown(), false, 'Escape dismisses');
pointer('pointermove', 501, 801);
assert.equal(shown(), false, 'Escape suppresses until zone exit');
pointer('pointermove', 500, 200);
pointer('pointermove', 500, 800);
assert.equal(shown(), true, 'zone reentry restores reveal');
document.modal = true;
assert.equal(escape(), false, 'modal/room Escape remains unconsumed');
assert.equal(shown(), true, 'modal/room Escape is not intercepted');
document.modal = false;
pointer('pointermove', 500, 200);
document.activeElement = timeline;
timeline.dispatchEvent(new Event('focusin'));
expire();
assert.equal(shown(), true, 'keyboard focus persists');
document.activeElement = null;
timeline.dispatchEvent(new Event('focusout'));
expire();
assert.equal(shown(), false);
cue.dispatchEvent(new Event('click'));
assert.equal(shown(), true, 'accessible cue activation reveals');
prefs.current.alwaysShowChrome = true;
prefs.callback();
pointer('pointermove', 500, 200);
expire();
assert.equal(shown(), true, 'always-visible preference wins over pending timers');
prefs.current.alwaysShowChrome = false;
prefs.callback();
pointer('pointerdown', 500, 200, { pointerType: 'touch' });
assert.equal(shown(), true, 'touch restores persistent timeline even on hybrid input');
assert.equal(timeline.dataset.autoHide, 'false');
assert.equal(cue.hidden, true);
pointer('pointerup', 500, 200);
pointer('pointermove', 500, 200);
assert.equal(shown(), false, 'mouse input restores desktop clean mode');
media.matches = false;
media.dispatchEvent(new Event('change'));
expire();
assert.equal(shown(), true, 'coarse input never gets new auto-hide');
media.matches = true;
media.dispatchEvent(new Event('change'));
timeline.rect.top = 600;
window.dispatchEvent(new Event('resize'));
pointer('pointermove', 500, 569);
assert.equal(shown(), true, 'resize remeasures the responsive resting zone');
manager.setTimelineAvailable(false);
expire();
assert.equal(timeline.hidden, true);
assert.equal(cue.hidden, true);
assert.equal(shown(), false, 'view exit cancels visibility and timers');
manager.dispose();
pointer('pointermove', 500, 800);
assert.equal(timers.size, 0, 'disposal removes listeners and timers');
console.log('PASS: timeline visibility, measured proximity, persistence, drag, Escape, input and view lifecycle.');
