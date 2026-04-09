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

// Dashboard clock configuration
export interface DashboardClock {
    id: string;
    name: string;        // e.g., "Zulu", "Local", "Doha"
    timezone: string;    // e.g., "UTC", "America/New_York", "Asia/Qatar"
}

export interface AppConfig {
    configured: boolean;
    backend: BackendType;
    mysqlUrl?: string;
    cesiumToken?: string;
    // Country-specific echelon configurations
    countryEchelons?: Record<string, string[]>;  // country -> list of enabled echelons
    // Dashboard clocks
    dashboardClocks?: DashboardClock[];
}

// Default clocks: Local time and Zulu (UTC)
export const DEFAULT_CLOCKS: DashboardClock[] = [
    { id: 'local', name: 'Local', timezone: 'local' },
    { id: 'zulu', name: 'Zulu', timezone: 'UTC' }
];

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

// Common timezone options for users to choose from
export const COMMON_TIMEZONES = [
    { value: 'local', label: 'Local Time' },
    { value: 'UTC', label: 'UTC (Zulu)' },
    { value: 'America/New_York', label: 'Eastern Time (US)' },
    { value: 'America/Chicago', label: 'Central Time (US)' },
    { value: 'America/Denver', label: 'Mountain Time (US)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'Asia/Qatar', label: 'Doha (Qatar)' },
    { value: 'Asia/Dubai', label: 'Dubai (UAE)' },
    { value: 'Asia/Kabul', label: 'Kabul (Afghanistan)' },
    { value: 'Asia/Seoul', label: 'Seoul (South Korea)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (Japan)' },
    { value: 'Australia/Sydney', label: 'Sydney (Australia)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii' },
];
