/**
 * Theming is retired as a user-facing choice.
 * ForceSight ships with a single visual system defined in `index.css`.
 *
 * These exports are kept as thin shims for the Settings dialog and any
 * localStorage entries left over from the dual-theme era.
 */

export interface Theme {
    id: string;
    name: string;
    description: string;
}

export const themes: Theme[] = [
    {
        id: 'army',
        name: 'Standard',
        description: 'The ForceSight house style — stone neutrals, brass accents.',
    },
];

const STORAGE_KEY = 'forcesight-theme';

export function getStoredTheme(): string {
    return 'army';
}

export function applyTheme(themeId: string): void {
    const root = document.documentElement;
    root.setAttribute('data-theme', 'army');
    try {
        localStorage.setItem(STORAGE_KEY, themeId || 'army');
    } catch {
        // localStorage unavailable
    }
}
