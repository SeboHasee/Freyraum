/**
 * German labels and shared types for the placement editor panel (v1.35).
 * Kept separate from MainMuseumHub so the room bar, artwork list, and save
 * tab use the same wording for walls, places, rooms, and messages.
 */

export type CalibrationIssueLevel = 'error' | 'hint';

/**
 * One validation message. Errors block export (unreadable file, missing wall,
 * broken wall shape); hints describe layout problems and never block export.
 */
export interface CalibrationIssue {
  level: CalibrationIssueLevel;
  text: string;
  slotId?: string;
  wallId?: string;
  pageIndex?: number;
}

export type RoomStatus = 'ok' | 'hint' | 'error';

const PLACE_LABELS: Readonly<Record<string, string>> = {
  'wall-front.a': 'Frontwand links',
  'wall-front.b': 'Frontwand rechts',
  'wall-left.a': 'Linke Wand',
  'wall-right.a': 'Rechte Wand',
};

export function wallLabel(wallId: string): string {
  if (wallId === 'wall-front') return 'Frontwand';
  if (wallId === 'wall-left') return 'Linke Wand';
  if (wallId === 'wall-right') return 'Rechte Wand';
  if (wallId === 'wall-rear') return 'Eingangsbereich';
  return wallId;
}

/** Place label for a slot id such as `room-02.wall-front.a` → "Frontwand links". */
export function placeLabel(slotId: string, wallId?: string): string {
  const suffix = slotId.replace(/^room-\d+\./, '');
  return PLACE_LABELS[suffix] ?? (wallId ? wallLabel(wallId) : suffix);
}

/** "Raum 2" or "Raum 2 · Foyer" for a zero-based room index. */
export function roomLabel(pageIndex: number, name?: string | null): string {
  const base = `Raum ${pageIndex + 1}`;
  // A name equal to the default label ("Raum 1") adds nothing.
  return name && name.trim() !== base ? `${base} · ${name.trim()}` : base;
}

export function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function statusOfIssues(issues: readonly CalibrationIssue[]): RoomStatus {
  if (issues.some((issue) => issue.level === 'error')) return 'error';
  return issues.length > 0 ? 'hint' : 'ok';
}
