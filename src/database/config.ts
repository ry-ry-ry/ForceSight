import type { BackendType } from './types';

const CONFIG_KEY = 'forcesight-config';

export interface AppConfig {
    configured: boolean;
    backend: BackendType;
    mysqlUrl?: string;
    cesiumToken?: string;
}

const DEFAULT_CONFIG: AppConfig = {
    configured: false,
    backend: 'indexeddb',
};

export function getConfig(): AppConfig {
    try {
        const raw = localStorage.getItem(CONFIG_KEY);
        if (!raw) return DEFAULT_CONFIG;
        return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    } catch {
        return DEFAULT_CONFIG;
    }
}

export function saveConfig(config: AppConfig): void {
    try {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    } catch {
        // localStorage unavailable
    }
}

export function isConfigured(): boolean {
    return getConfig().configured;
}

export function resetConfig(): void {
    try {
        localStorage.removeItem(CONFIG_KEY);
    } catch {
        // localStorage unavailable
    }
}
