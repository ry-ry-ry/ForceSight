export interface Theme {
    id: string;
    name: string;
    description: string;
}

export const themes: Theme[] = [
    { id: 'cyber', name: 'Cyber', description: 'Cyan neon on deep navy — digital warfare aesthetic' },
    { id: 'army', name: 'Army', description: 'Brass on earth tones — operational command dashboard' },
];

const STORAGE_KEY = 'forcesight-theme';

export function getStoredTheme(): string {
    try {
        return localStorage.getItem(STORAGE_KEY) || 'army';
    } catch {
        return 'army';
    }
}

export function applyTheme(themeId: string): void {
    const root = document.documentElement;
    if (themeId === 'cyber') {
        root.removeAttribute('data-theme');
    } else {
        root.setAttribute('data-theme', themeId);
    }
    try {
        localStorage.setItem(STORAGE_KEY, themeId);
    } catch {
        // localStorage unavailable
    }
}
