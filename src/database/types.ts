// ── Domain model interfaces ──────────────────────────────────────────────────

export interface Unit {
    id: string;
    name: string;
    type: string;
    echelon?: string;
    country?: string;
    status: string;
    health?: 'Healthy' | 'Damaged' | 'Destroyed';
    effectiveness?: number; // 0–100 in 10% increments
    parentId?: string;
    attached?: boolean; // true = attached for admin only, not full hierarchy membership
    taskForceId?: string;
    lastRTBDate?: string;
    locationLat?: number;
    locationLng?: number;
    patch?: string; // base64 encoded image
    // NATO symbol fields
    natoSymbol?: string; // APP-6 code (e.g., "sfgp" for infantry)
    affiliation?: 'friendly' | 'hostile' | 'neutral' | 'unknown';
    sizeSymbolOverride?: string; // manual override for echelon marker
    createdAt: number;
}

export interface Deployment {
    id: string;
    unitId: string;
    name: string;
    operation?: string;
    operationId?: string;
    startDate: string;
    endDate?: string;
}

export interface Operation {
    id: string;
    name: string;
    type: 'Campaign' | 'Tactical' | 'Training' | 'Humanitarian' | 'Other';
    description?: string;
    startDate: string;
    endDate?: string;
    status: 'Planning' | 'Active' | 'Completed' | 'Suspended';
    createdAt: number;
}

export interface Mission {
    id: string;
    unitId: string;
    operationId?: string;
    name: string;
    type: 'Raid' | 'Reconnaissance' | 'Support' | 'Training' | 'Other';
    startDate: string;
    endDate?: string;
    description?: string;
}

export interface TaskForce {
    id: string;
    name: string;
    operationId?: string;
    description?: string;
    createdAt: number;
}

export interface MapIcon {
    id: string;
    name: string;
    image: string; // base64 encoded
    createdAt: number;
}

export interface MapPin {
    id: string;
    name: string;
    iconId?: string;
    lat: number;
    lng: number;
    description?: string;
    properties?: string; // JSON string
    createdAt: number;
}

export interface MapShape {
    id: string;
    name: string;
    type: 'polygon' | 'polyline' | 'circle';
    coordinates: string; // JSON string: [number, number][]
    style: string; // JSON string: { color, fillOpacity, lineWidth }
    description?: string;
    createdAt: number;
}

export interface NatoSymbol {
    id: string;
    name: string;
    code?: string; // APP-6 code if applicable
    image: string; // base64 encoded SVG/PNG
    createdAt: number;
}

// ── Backup / export format ────────────────────────────────────────────────────

export interface BackupData {
    version: number;
    timestamp: string;
    data: {
        units: Unit[];
        deployments: Deployment[];
        operations: Operation[];
        missions: Mission[];
        taskForces: TaskForce[];
        mapIcons: MapIcon[];
        mapPins: MapPin[];
        mapShapes: MapShape[];
        natoSymbols: NatoSymbol[];
    };
}

// ── Adapter interfaces ────────────────────────────────────────────────────────

export interface QueryAdapter<T> {
    toArray(): Promise<T[]>;
    sortBy(field: keyof T): Promise<T[]>;
}

export interface TableAdapter<T> {
    toArray(): Promise<T[]>;
    get(id: string): Promise<T | undefined>;
    put(item: T): Promise<void>;
    bulkPut(items: T[]): Promise<void>;
    update(id: string, changes: Partial<T>): Promise<void>;
    delete(id: string): Promise<void>;
    clear(): Promise<void>;
    where(field: keyof T): WhereClause<T>;
    orderBy(field: keyof T): QueryAdapter<T>;
}

export interface WhereClause<T> {
    equals(value: string | number): QueryAdapter<T>;
}

export interface DatabaseAdapter {
    // Lifecycle
    init(): Promise<void>;
    close(): Promise<void>;

    // Tables
    units: TableAdapter<Unit>;
    deployments: TableAdapter<Deployment>;
    operations: TableAdapter<Operation>;
    missions: TableAdapter<Mission>;
    taskForces: TableAdapter<TaskForce>;
    mapIcons: TableAdapter<MapIcon>;
    mapPins: TableAdapter<MapPin>;
    mapShapes: TableAdapter<MapShape>;
    natoSymbols: TableAdapter<NatoSymbol>;

    // Bulk operations
    exportAll(): Promise<BackupData>;
    importAll(data: BackupData, mode: 'replace' | 'merge'): Promise<void>;
    clearAll(): Promise<void>;

    // Native database file export/import (optional — SQLite only)
    exportRaw?(): Promise<Uint8Array>;
    importRaw?(data: Uint8Array): Promise<void>;

    // Reactivity
    subscribe(callback: () => void): () => void;
    getVersion(): number;
}

export type BackendType = 'indexeddb' | 'sqlite' | 'mysql';
