const STORAGE_KEY = 'forcesight-cesium-token';

export function getCesiumToken(): string | null {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

export function setCesiumToken(token: string): void {
    try {
        localStorage.setItem(STORAGE_KEY, token);
    } catch {
        // localStorage unavailable
    }
}

export function hasCesiumToken(): boolean {
    return !!getCesiumToken();
}
