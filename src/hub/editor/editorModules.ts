/**
 * v1.46 (B3): editor UI classes, loaded with a dynamic `import()` only when
 * the placement editor opens. Visitors never download this chunk.
 * `MainMuseumHub` keeps type-only imports of these modules.
 */
export { createEditorTabs } from './editorTabs';
export { EditorRoomBar } from './roomBar';
export { EditorArtworkLibrary } from './artworkLibrary';
export { EditorSaveTab } from './saveTab';
export { EditorGalleryRoomViews } from './galleryRoomViews';
export { PlacementController } from './placementController';
export { EditorToast } from './editorToast';
export { OnlineEditor } from './onlineEditor';

export type EditorModules = typeof import('./editorModules');
