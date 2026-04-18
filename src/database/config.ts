import type { BackendType } from './types';

const CONFIG_KEY = 'forcesight-config';

// Default echelons available when no country-specific config exists
export const DEFAULT_ECHELONS = [
    'Team/Crew', 'Squad', 'Section', 'Platoon', 'Company',
    'Squadron', 'Group', 'Battalion', 'Regiment', 'Wing', 'Brigade',
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

    // Americas
    { value: 'Pacific/Honolulu', label: 'Hawaii' },
    { value: 'America/Anchorage', label: 'Anchorage (Alaska)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
    { value: 'America/Denver', label: 'Mountain Time (US)' },
    { value: 'America/Chicago', label: 'Central Time (US)' },
    { value: 'America/New_York', label: 'Eastern Time (US)' },
    { value: 'America/Toronto', label: 'Toronto (Canada)' },
    { value: 'America/Mexico_City', label: 'Mexico City' },
    { value: 'America/Bogota', label: 'Bogot\u00e1 (Colombia)' },
    { value: 'America/Sao_Paulo', label: 'S\u00e3o Paulo (Brazil)' },
    { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires (Argentina)' },

    // Europe
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Dublin', label: 'Dublin (Ireland)' },
    { value: 'Europe/Lisbon', label: 'Lisbon (Portugal)' },
    { value: 'Europe/Madrid', label: 'Madrid (Spain)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'Europe/Brussels', label: 'Brussels (Belgium)' },
    { value: 'Europe/Amsterdam', label: 'Amsterdam (Netherlands)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
    { value: 'Europe/Rome', label: 'Rome (Italy)' },
    { value: 'Europe/Oslo', label: 'Oslo (Norway)' },
    { value: 'Europe/Stockholm', label: 'Stockholm (Sweden)' },
    { value: 'Europe/Helsinki', label: 'Helsinki (Finland)' },
    { value: 'Europe/Warsaw', label: 'Warsaw (Poland)' },
    { value: 'Europe/Kyiv', label: 'Kyiv (Ukraine)' },
    { value: 'Europe/Istanbul', label: 'Istanbul (T\u00fcrkiye)' },
    { value: 'Europe/Moscow', label: 'Moscow (Russia)' },

    // Africa & Middle East
    { value: 'Africa/Cairo', label: 'Cairo (Egypt)' },
    { value: 'Africa/Johannesburg', label: 'Johannesburg (South Africa)' },
    { value: 'Asia/Jerusalem', label: 'Tel Aviv (Israel)' },
    { value: 'Asia/Baghdad', label: 'Baghdad (Iraq)' },
    { value: 'Asia/Riyadh', label: 'Riyadh (Saudi Arabia)' },
    { value: 'Asia/Qatar', label: 'Doha (Qatar)' },
    { value: 'Asia/Dubai', label: 'Dubai (UAE)' },
    { value: 'Asia/Tehran', label: 'Tehran (Iran)' },

    // Asia
    { value: 'Asia/Karachi', label: 'Karachi (Pakistan)' },
    { value: 'Asia/Kabul', label: 'Kabul (Afghanistan)' },
    { value: 'Asia/Kolkata', label: 'New Delhi (India)' },
    { value: 'Asia/Bangkok', label: 'Bangkok (Thailand)' },
    { value: 'Asia/Jakarta', label: 'Jakarta (Indonesia)' },
    { value: 'Asia/Singapore', label: 'Singapore' },
    { value: 'Asia/Manila', label: 'Manila (Philippines)' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong' },
    { value: 'Asia/Shanghai', label: 'Beijing/Shanghai (China)' },
    { value: 'Asia/Seoul', label: 'Seoul (South Korea)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (Japan)' },

    // Pacific
    { value: 'Australia/Perth', label: 'Perth (Australia)' },
    { value: 'Australia/Sydney', label: 'Sydney (Australia)' },
    { value: 'Pacific/Auckland', label: 'Auckland (New Zealand)' },
];
