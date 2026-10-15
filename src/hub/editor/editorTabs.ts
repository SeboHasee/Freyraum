/**
 * Accessible tab strip for the placement editor (WAI-ARIA tabs pattern):
 * one tab stop, arrow keys / Home / End move between tabs and activate them.
 */

export interface EditorTabDefinition {
  id: string;
  label: string;
  panel: HTMLElement;
}

export interface EditorTabs {
  readonly list: HTMLElement;
  readonly panels: readonly HTMLElement[];
  select(id: string, focus?: boolean): void;
  readonly selectedId: string;
}

export function createEditorTabs(prefix: string, label: string, tabs: readonly EditorTabDefinition[]): EditorTabs {
  const list = document.createElement('div');
  list.className = 'museum-hub__editor-tabs';
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-label', label);
  const buttons: HTMLButtonElement[] = [];
  let selectedId = tabs[0]?.id ?? '';

  const select = (id: string, focus = false): void => {
    const index = tabs.findIndex((tab) => tab.id === id);
    if (index < 0) return;
    selectedId = id;
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      const button = buttons[tabIndex]!;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
      button.classList.toggle('is-active', active);
      tab.panel.hidden = !active;
    });
    if (focus) buttons[index]!.focus();
  };

  tabs.forEach((tab, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.id = `${prefix}-tab-${tab.id}`;
    button.className = 'museum-hub__editor-tab';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `${prefix}-panel-${tab.id}`);
    button.textContent = tab.label;
    button.addEventListener('click', () => select(tab.id));
    button.addEventListener('keydown', (event) => {
      let next = -1;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      if (next < 0) return;
      event.preventDefault();
      event.stopPropagation();
      select(tabs[next]!.id, true);
    });
    tab.panel.id = `${prefix}-panel-${tab.id}`;
    tab.panel.setAttribute('role', 'tabpanel');
    tab.panel.setAttribute('aria-labelledby', button.id);
    tab.panel.tabIndex = 0;
    tab.panel.classList.add('museum-hub__editor-tabpanel');
    buttons.push(button);
    list.appendChild(button);
  });
  select(selectedId);

  return {
    list,
    panels: tabs.map((tab) => tab.panel),
    select,
    get selectedId() {
      return selectedId;
    },
  };
}
