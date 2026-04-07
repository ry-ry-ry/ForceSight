import type { BackendType } from './types';

const CONFIG_KEY = 'forcesight-config';

// Default echelons available when no country-specific config exists
export const DEFAULT_ECHELONS = [
    'Team/Crew', 'Squad', 'Section', 'Platoon', 'Company',
    'Squadron', 'Battalion', 'Regiment', 'Brigade',
    'Division', 'Corps', 'Army', 'Army Group', 'Command'
];

// Predefined list of countries for selection
export const AVAILABLE_COUNTRIES = [
    'United States', 'United Kingdom', 'Germany', 'France',
    'Poland', 'Ukraine', 'Russia', 'China', 'Japan',
    'South Korea', 'Australia', 'Canada', 'NATO', 'Other'
];

export interface AppConfig {
    configured: boolean;
    backend: BackendType;
    mysqlUrl?: string;
    cesiumToken?: string;
    // Country-specific echelon configurations
    countryEchelons?: Record<string, string[]>;  // country -> list of enabled echelons
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
