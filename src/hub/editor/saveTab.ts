/**
 * "Speichern" tab of the placement editor (v1.35): status card, validation
 * messages (clicking one opens its room and artwork), one large download
 * button, copy, open file, restore, the unplaced-artwork setting, and an
 * "Erweitert" section with diagnostics and the raw JSON.
 */
import { countLabel, type CalibrationIssue } from './editorText';

export interface SaveTabCallbacks {
  onDownload(): void;
  onCopy(): void;
  onImport(file: File | null): void;
  onRestore(): void;
  onDiagnostics(): void;
  onAutoPlaceChange(enabled: boolean): void;
  onIssueSelect(issue: CalibrationIssue): void;
}

export class EditorSaveTab {
  readonly element: HTMLElement;
  readonly output: HTMLTextAreaElement;
  readonly issueList: HTMLUListElement;
  readonly downloadButton: HTMLButtonElement;
  readonly copyButton: HTMLButtonElement;
  readonly restoreButton: HTMLButtonElement;
  private readonly statusCard: HTMLElement;
  private readonly statusTitle: HTMLElement;
  private readonly statusText: HTMLElement;
  private readonly autoPlace: HTMLInputElement;
  private readonly proofs: HTMLUListElement;

  constructor(private readonly callbacks: SaveTabCallbacks) {
    const element = document.createElement('div');

    const statusCard = document.createElement('section');
    statusCard.className = 'museum-hub__save-status';
    statusCard.setAttribute('aria-labelledby', 'editor-save-status-title');
    const statusTitle = document.createElement('h3');
    statusTitle.id = 'editor-save-status-title';
    const statusText = document.createElement('p');
    const issueList = document.createElement('ul');
    issueList.className = 'museum-hub__calibration-warnings';
    issueList.setAttribute('aria-label', 'Meldungen');
    statusCard.append(statusTitle, statusText, issueList);

    const actions = document.createElement('section');
    actions.className = 'museum-hub__editor-section';
    actions.setAttribute('aria-label', 'Speichern');
    const download = this.makeButton('Konfiguration herunterladen', 'museum-hub__calibration-action museum-hub__save-primary', () => this.callbacks.onDownload());
    const secondary = document.createElement('div');
    secondary.className = 'museum-hub__editor-actions';
    const copy = this.makeButton('JSON kopieren', 'museum-hub__calibration-action', () => this.callbacks.onCopy());
    const importLabel = document.createElement('label');
    importLabel.className = 'museum-hub__calibration-action museum-hub__calibration-import';
    importLabel.textContent = 'Datei öffnen';
    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = 'application/json,.json';
    importInput.className = 'museum-hub__file-input';
    importInput.addEventListener('change', () => {
      this.callbacks.onImport(importInput.files?.[0] ?? null);
      importInput.value = '';
    });
    importLabel.appendChild(importInput);
    const restore = this.makeButton('Letzte gültige Version wiederherstellen', 'museum-hub__calibration-action museum-hub__calibration-restore', () => this.callbacks.onRestore());
    restore.disabled = true;
    secondary.append(copy, importLabel, restore);
    const saveHint = document.createElement('p');
    saveHint.className = 'museum-hub__editor-hint';
    saveHint.textContent =
      'Die heruntergeladene Datei museum-hub.json ersetzt die Datei im Ordner customer-artworks. Hinweise blockieren das Speichern nicht; nur Fehler müssen zuerst behoben werden.';
    actions.append(download, secondary, saveHint);

    const settings = document.createElement('section');
    settings.className = 'museum-hub__editor-section';
    settings.setAttribute('aria-labelledby', 'editor-save-settings-title');
    const settingsTitle = document.createElement('h3');
    settingsTitle.id = 'editor-save-settings-title';
    settingsTitle.textContent = 'Nicht platzierte Bilder';
    const autoPlaceLabel = document.createElement('label');
    autoPlaceLabel.className = 'museum-hub__editor-check';
    const autoPlace = document.createElement('input');
    autoPlace.type = 'checkbox';
    autoPlace.addEventListener('change', () => this.callbacks.onAutoPlaceChange(autoPlace.checked));
    autoPlaceLabel.append(
      autoPlace,
      'In der Galerie automatisch in zusätzliche Räume hängen (sonst bleiben sie unsichtbar)'
    );
    settings.append(settingsTitle, autoPlaceLabel);

    const advanced = document.createElement('details');
    advanced.className = 'museum-hub__calibration-advanced';
    const summary = document.createElement('summary');
    summary.textContent = 'Erweitert: Diagnose und JSON';
    const diagnostics = this.makeButton('Diagnose herunterladen', 'museum-hub__calibration-action', () => this.callbacks.onDiagnostics());
    const proofs = document.createElement('ul');
    proofs.className = 'museum-hub__calibration-proofs';
    proofs.setAttribute('aria-label', 'Technische Prüfwerte');
    const output = document.createElement('textarea');
    output.className = 'museum-hub__calibration-output';
    output.readOnly = true;
    output.rows = 14;
    output.setAttribute('aria-label', 'Museum-Konfiguration als JSON');
    advanced.append(summary, diagnostics, proofs, output);

    element.append(statusCard, actions, settings, advanced);
    this.element = element;
    this.output = output;
    this.issueList = issueList;
    this.downloadButton = download;
    this.copyButton = copy;
    this.restoreButton = restore;
    this.statusCard = statusCard;
    this.statusTitle = statusTitle;
    this.statusText = statusText;
    this.autoPlace = autoPlace;
    this.proofs = proofs;
  }

  update(state: {
    issues: readonly (CalibrationIssue & { prefix: string })[];
    exportValid: boolean;
    autoPlace: boolean;
    unplacedCount: number;
    proofs: readonly string[];
  }): void {
    const errors = state.issues.filter((issue) => issue.level === 'error').length;
    const hints = state.issues.length - errors;
    this.statusCard.classList.toggle('is-error', errors > 0);
    this.statusCard.classList.toggle('is-hint', errors === 0 && hints > 0);
    this.statusTitle.textContent = errors > 0
      ? `${countLabel(errors, 'Fehler', 'Fehler')}${hints > 0 ? ` · ${countLabel(hints, 'Hinweis', 'Hinweise')}` : ''}`
      : hints > 0
        ? countLabel(hints, 'Hinweis', 'Hinweise')
        : 'Alles bereit';
    this.statusText.textContent = errors > 0
      ? 'Speichern ist gesperrt, bis die Fehler behoben sind. Eine Meldung anklicken öffnet die Stelle.'
      : hints > 0
        ? 'Speichern ist möglich. Die Hinweise zeigen, was in der Galerie noch nicht optimal aussieht.'
        : 'Die Konfiguration kann jetzt heruntergeladen werden.';
    this.downloadButton.disabled = !state.exportValid;
    this.copyButton.disabled = !state.exportValid;
    this.autoPlace.checked = state.autoPlace;

    this.issueList.replaceChildren();
    const ordered = [...state.issues].sort((a, b) => (a.level === b.level ? 0 : a.level === 'error' ? -1 : 1));
    for (const issue of ordered) {
      const item = document.createElement('li');
      item.className = `is-${issue.level}`;
      item.dataset['level'] = issue.level;
      if (issue.slotId) item.dataset['slotId'] = issue.slotId;
      if (issue.pageIndex !== undefined) item.dataset['page'] = String(issue.pageIndex);
      const text = `${issue.level === 'error' ? 'Fehler' : 'Hinweis'}: ${issue.prefix}${issue.text}`;
      if (issue.slotId || issue.pageIndex !== undefined || issue.wallId) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'museum-hub__issue-link';
        button.textContent = text;
        button.addEventListener('click', () => this.callbacks.onIssueSelect(issue));
        item.appendChild(button);
      } else {
        item.textContent = text;
      }
      this.issueList.appendChild(item);
    }
    this.proofs.replaceChildren(
      ...state.proofs.map((proof) => {
        const item = document.createElement('li');
        item.textContent = proof;
        return item;
      })
    );
  }

  setRestoreAvailable(available: boolean): void {
    this.restoreButton.disabled = !available;
  }

  private makeButton(text: string, className: string, action: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = text;
    button.addEventListener('click', action);
    return button;
  }
}
