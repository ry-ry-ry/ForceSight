import type {
    DatabaseAdapter, TableAdapter, WhereClause, QueryAdapter,
    Unit, Deployment, Operation, Mission, TaskForce,
    MapIcon, MapPin, MapShape, NatoSymbol, BackupData
} from './types';

// sql.js types (loaded dynamically)
type SqlJsDatabase = any;
type SqlJsStatic = any;

const DB_FILE_NAME = 'forcesight.sqlite';
const SCHEMA_VERSION = 2;

// ── SQL table definitions ─────────────────────────────────────────────────────

const TABLE_SCHEMAS: Record<string, string> = {
    units: `CREATE TABLE IF NOT EXISTS units (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        echelon TEXT,
        country TEXT,
        status TEXT NOT NULL,
        health TEXT,
        effectiveness INTEGER,
        parentId TEXT,
        attached INTEGER,
        taskForceId TEXT,
        lastRTBDate TEXT,
        locationLat REAL,
        locationLng REAL,
        patch TEXT,
        natoSymbol TEXT,
        affiliation TEXT,
        sizeSymbolOverride TEXT,
        location TEXT,
        baseId TEXT,
        createdAt INTEGER NOT NULL
    )`,
    deployments: `CREATE TABLE IF NOT EXISTS deployments (
        id TEXT PRIMARY KEY,
        unitId TEXT NOT NULL,
        name TEXT NOT NULL,
        operation TEXT,
        operationId TEXT,
        startDate TEXT NOT NULL,
        endDate TEXT
    )`,
    operations: `CREATE TABLE IF NOT EXISTS operations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        startDate TEXT NOT NULL,
        endDate TEXT,
        status TEXT NOT NULL,
        createdAt INTEGER NOT NULL
    )`,
    missions: `CREATE TABLE IF NOT EXISTS missions (
        id TEXT PRIMARY KEY,
        unitId TEXT NOT NULL,
        operationId TEXT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        startDate TEXT NOT NULL,
        endDate TEXT,
        description TEXT
    )`,
    taskForces: `CREATE TABLE IF NOT EXISTS taskForces (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        operationId TEXT,
        description TEXT,
        createdAt INTEGER NOT NULL
    )`,
    mapIcons: `CREATE TABLE IF NOT EXISTS mapIcons (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        image TEXT NOT NULL,
        createdAt INTEGER NOT NULL
    )`,
    mapPins: `CREATE TABLE IF NOT EXISTS mapPins (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        iconId TEXT,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        description TEXT,
        properties TEXT,
        createdAt INTEGER NOT NULL
    )`,
    mapShapes: `CREATE TABLE IF NOT EXISTS mapShapes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        coordinates TEXT NOT NULL,
        style TEXT NOT NULL,
        description TEXT,
        createdAt INTEGER NOT NULL
    )`,
    natoSymbols: `CREATE TABLE IF NOT EXISTS natoSymbols (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT,
        image TEXT NOT NULL,
        createdAt INTEGER NOT NULL
    )`,
};

const MIGRATIONS_TABLE = `CREATE TABLE IF NOT EXISTS _migrations (
    version INTEGER PRIMARY KEY,
    appliedAt TEXT NOT NULL
)`;

// ── Column lists per table (for INSERT generation) ────────────────────────────

const TABLE_COLUMNS: Record<string, string[]> = {
    units: ['id', 'name', 'type', 'echelon', 'country', 'status', 'health', 'effectiveness', 'parentId', 'attached', 'taskForceId', 'lastRTBDate', 'locationLat', 'locationLng', 'patch', 'natoSymbol', 'affiliation', 'sizeSymbolOverride', 'location', 'baseId', 'createdAt'],
    deployments: ['id', 'unitId', 'name', 'operation', 'operationId', 'startDate', 'endDate'],
    operations: ['id', 'name', 'type', 'description', 'startDate', 'endDate', 'status', 'createdAt'],
    missions: ['id', 'unitId', 'operationId', 'name', 'type', 'startDate', 'endDate', 'description'],
    taskForces: ['id', 'name', 'operationId', 'description', 'createdAt'],
    mapIcons: ['id', 'name', 'image', 'createdAt'],
    mapPins: ['id', 'name', 'iconId', 'lat', 'lng', 'description', 'properties', 'createdAt'],
    mapShapes: ['id', 'name', 'type', 'coordinates', 'style', 'description', 'createdAt'],
    natoSymbols: ['id', 'name', 'code', 'image', 'createdAt'],
};

// ── OPFS persistence helpers ──────────────────────────────────────────────────

async function loadFromOPFS(): Promise<Uint8Array | null> {
    try {
        const root = await navigator.storage.getDirectory();
        const fileHandle = await root.getFileHandle(DB_FILE_NAME);
        const file = await fileHandle.getFile();
        const buffer = await file.arrayBuffer();
        return buffer.byteLength > 0 ? new Uint8Array(buffer) : null;
    } catch {
        return null; // file doesn't exist yet
    }
}

async function saveToOPFS(data: Uint8Array): Promise<void> {
    try {
        const root = await navigator.storage.getDirectory();
        const fileHandle = await root.getFileHandle(DB_FILE_NAME, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(data.buffer as ArrayBuffer);
        await writable.close();
    } catch (err) {
        console.error('Failed to save SQLite to OPFS:', err);
    }
}

// ── SQLite table wrapper ──────────────────────────────────────────────────────

function sqliteTable<T extends { id: string }>(
    getDb: () => SqlJsDatabase,
    tableName: string,
    columns: string[],
    notify: () => void,
    scheduleSave: () => void
): TableAdapter<T> {
    // Boolean fields that need conversion
    const booleanFields = ['attached'];

    const toDbValue = (col: string, val: any): any => {
        if (val === undefined || val === null) return null;
        if (booleanFields.includes(col) && typeof val === 'boolean') {
            return val ? 1 : 0;
        }
        return val;
    };

    const rowToObj = (row: any[], colNames: string[]): T => {
        const obj: any = {};
        colNames.forEach((col, i) => {
            const val = row[i];
            // Convert SQLite INTEGER (0/1) to boolean for boolean fields
            if (booleanFields.includes(col)) {
                obj[col] = val === 1;
            } else {
                obj[col] = val === null ? undefined : val;
            }
        });
        return obj as T;
    };

    const queryAll = (): T[] => {
        const db = getDb();
        const stmt = db.prepare(`SELECT * FROM ${tableName}`);
        const results: T[] = [];
        const colNames = stmt.getColumnNames();
        while (stmt.step()) {
            results.push(rowToObj(stmt.get(), colNames));
        }
        stmt.free();
        return results;
    };

    const upsertSql = `INSERT OR REPLACE INTO ${tableName} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;

    return {
        toArray: async () => queryAll(),

        get: async (id) => {
            const db = getDb();
            const stmt = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`);
            stmt.bind([id]);
            let result: T | undefined;
            if (stmt.step()) {
                result = rowToObj(stmt.get(), stmt.getColumnNames());
            }
            stmt.free();
            return result;
        },

        put: async (item) => {
            const db = getDb();
            const vals = columns.map(c => toDbValue(c, (item as any)[c]));
            db.run(upsertSql, vals);
            notify();
            scheduleSave();
        },

        bulkPut: async (items) => {
            const db = getDb();
            for (const item of items) {
                const vals = columns.map(c => toDbValue(c, (item as any)[c]));
                db.run(upsertSql, vals);
            }
            notify();
            scheduleSave();
        },

        update: async (id, changes) => {
            const db = getDb();
            const keys = Object.keys(changes).filter(k => k !== 'id');
            if (keys.length === 0) return;
            const sets = keys.map(k => `${k} = ?`).join(', ');
            const vals = keys.map(k => toDbValue(k, (changes as any)[k]));
            vals.push(id);
            db.run(`UPDATE ${tableName} SET ${sets} WHERE id = ?`, vals);
            notify();
            scheduleSave();
        },

        delete: async (id) => {
            const db = getDb();
            db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
            notify();
            scheduleSave();
        },

        clear: async () => {
            const db = getDb();
            db.run(`DELETE FROM ${tableName}`);
            notify();
            scheduleSave();
        },

        where: (field) => ({
            equals: (value) => ({
                toArray: async () => {
                    const db = getDb();
                    const stmt = db.prepare(`SELECT * FROM ${tableName} WHERE ${field as string} = ?`);
                    stmt.bind([value]);
                    const results: T[] = [];
                    const colNames = stmt.getColumnNames();
                    while (stmt.step()) {
                        results.push(rowToObj(stmt.get(), colNames));
                    }
                    stmt.free();
                    return results;
                },
                sortBy: async (sortField) => {
                    const db = getDb();
                    const stmt = db.prepare(`SELECT * FROM ${tableName} WHERE ${field as string} = ? ORDER BY ${sortField as string}`);
                    stmt.bind([value]);
                    const results: T[] = [];
                    const colNames = stmt.getColumnNames();
                    while (stmt.step()) {
                        results.push(rowToObj(stmt.get(), colNames));
                    }
                    stmt.free();
                    return results;
                },
            }),
        }) as WhereClause<T>,

        orderBy: (field) => ({
            toArray: async () => {
                const db = getDb();
                const stmt = db.prepare(`SELECT * FROM ${tableName} ORDER BY ${field as string}`);
                const results: T[] = [];
                const colNames = stmt.getColumnNames();
                while (stmt.step()) {
                    results.push(rowToObj(stmt.get(), colNames));
                }
                stmt.free();
                return results;
            },
            sortBy: async (sortField) => {
                const db = getDb();
                const stmt = db.prepare(`SELECT * FROM ${tableName} ORDER BY ${sortField as string}`);
                const results: T[] = [];
                const colNames = stmt.getColumnNames();
                while (stmt.step()) {
                    results.push(rowToObj(stmt.get(), colNames));
                }
                stmt.free();
                return results;
            },
        }) as QueryAdapter<T>,
    };
}

// ── SQLite Adapter ────────────────────────────────────────────────────────────

export class SQLiteAdapter implements DatabaseAdapter {
    private sqlDb: SqlJsDatabase | null = null;
    private version = 0;
    private listeners = new Set<() => void>();
    private saveTimer: ReturnType<typeof setTimeout> | null = null;

    units!: TableAdapter<Unit>;
    deployments!: TableAdapter<Deployment>;
    operations!: TableAdapter<Operation>;
    missions!: TableAdapter<Mission>;
    taskForces!: TableAdapter<TaskForce>;
    mapIcons!: TableAdapter<MapIcon>;
    mapPins!: TableAdapter<MapPin>;
    mapShapes!: TableAdapter<MapShape>;
    natoSymbols!: TableAdapter<NatoSymbol>;

    async init(): Promise<void> {
        // Dynamically import sql.js
        const initSqlJs: SqlJsStatic = (await import('sql.js')).default;
        const SQL = await initSqlJs({
            locateFile: () => '/sql-wasm.wasm'
        });

        // Load existing database from OPFS, or create new
        const existingData = await loadFromOPFS();
        this.sqlDb = existingData ? new SQL.Database(existingData) : new SQL.Database();

        // Create tables + migrations table
        this.sqlDb.run(MIGRATIONS_TABLE);
        for (const sql of Object.values(TABLE_SCHEMAS)) {
            this.sqlDb.run(sql);
        }

        // Run migrations for existing databases
        await this.runMigrations();

        // Record migration version
        this.sqlDb.run(
            'INSERT OR REPLACE INTO _migrations (version, appliedAt) VALUES (?, ?)',
            [SCHEMA_VERSION, new Date().toISOString()]
        );

        const getDb = () => this.sqlDb!;
        const notify = () => {
            this.version++;
            this.listeners.forEach(fn => fn());
        };
        const scheduleSave = () => this.scheduleSave();

        this.units = sqliteTable<Unit>(getDb, 'units', TABLE_COLUMNS.units, notify, scheduleSave);
        this.deployments = sqliteTable<Deployment>(getDb, 'deployments', TABLE_COLUMNS.deployments, notify, scheduleSave);
        this.operations = sqliteTable<Operation>(getDb, 'operations', TABLE_COLUMNS.operations, notify, scheduleSave);
        this.missions = sqliteTable<Mission>(getDb, 'missions', TABLE_COLUMNS.missions, notify, scheduleSave);
        this.taskForces = sqliteTable<TaskForce>(getDb, 'taskForces', TABLE_COLUMNS.taskForces, notify, scheduleSave);
        this.mapIcons = sqliteTable<MapIcon>(getDb, 'mapIcons', TABLE_COLUMNS.mapIcons, notify, scheduleSave);
        this.mapPins = sqliteTable<MapPin>(getDb, 'mapPins', TABLE_COLUMNS.mapPins, notify, scheduleSave);
        this.mapShapes = sqliteTable<MapShape>(getDb, 'mapShapes', TABLE_COLUMNS.mapShapes, notify, scheduleSave);
        this.natoSymbols = sqliteTable<NatoSymbol>(getDb, 'natoSymbols', TABLE_COLUMNS.natoSymbols, notify, scheduleSave);

        // Initial save
        await this.persistNow();
    }

    private scheduleSave(): void {
        if (this.saveTimer) clearTimeout(this.saveTimer);
        this.saveTimer = setTimeout(() => this.persistNow(), 500);
    }

    private async runMigrations(): Promise<void> {
        // Migration 1: Add NATO symbol columns to units table
        const columns = this.sqlDb!.exec("PRAGMA table_info(units)");
        const columnNames = columns[0]?.values?.map((v: any[]) => v[1]) || [];

        if (!columnNames.includes('natoSymbol')) {
            this.sqlDb!.run('ALTER TABLE units ADD COLUMN natoSymbol TEXT');
        }
        if (!columnNames.includes('affiliation')) {
            this.sqlDb!.run('ALTER TABLE units ADD COLUMN affiliation TEXT');
        }
        if (!columnNames.includes('sizeSymbolOverride')) {
            this.sqlDb!.run('ALTER TABLE units ADD COLUMN sizeSymbolOverride TEXT');
        }
        if (!columnNames.includes('attached')) {
            this.sqlDb!.run('ALTER TABLE units ADD COLUMN attached INTEGER');
        }
        // Migration 2: Add location and baseId columns for Bases feature
        if (!columnNames.includes('location')) {
            this.sqlDb!.run('ALTER TABLE units ADD COLUMN location TEXT');
        }
        if (!columnNames.includes('baseId')) {
            this.sqlDb!.run('ALTER TABLE units ADD COLUMN baseId TEXT');
        }
    }

    private async persistNow(): Promise<void> {
        if (!this.sqlDb) return;
        const data = this.sqlDb.export();
        await saveToOPFS(new Uint8Array(data));
    }

    async close(): Promise<void> {
        if (this.saveTimer) clearTimeout(this.saveTimer);
        await this.persistNow();
        this.sqlDb?.close();
        this.sqlDb = null;
    }

    async exportAll(): Promise<BackupData> {
        return {
            version: 7,
            timestamp: new Date().toISOString(),
            data: {
                units: await this.units.toArray(),
                deployments: await this.deployments.toArray(),
                operations: await this.operations.toArray(),
                missions: await this.missions.toArray(),
                taskForces: await this.taskForces.toArray(),
                mapIcons: await this.mapIcons.toArray(),
                mapPins: await this.mapPins.toArray(),
                mapShapes: await this.mapShapes.toArray(),
                natoSymbols: await this.natoSymbols.toArray(),
            }
        };
    }

    async importAll(data: BackupData, mode: 'replace' | 'merge'): Promise<void> {
        if (mode === 'replace') {
            await this.clearAll();
        }

        const src = data.data;
        if (src.units?.length) await this.units.bulkPut(src.units);
        if (src.deployments?.length) await this.deployments.bulkPut(src.deployments);
        if (src.operations?.length) await this.operations.bulkPut(src.operations);
        if (src.missions?.length) await this.missions.bulkPut(src.missions);
        if (src.taskForces?.length) await this.taskForces.bulkPut(src.taskForces);
        if (src.mapIcons?.length) await this.mapIcons.bulkPut(src.mapIcons);
        if (src.mapPins?.length) await this.mapPins.bulkPut(src.mapPins);
        if (src.mapShapes?.length) await this.mapShapes.bulkPut(src.mapShapes);
        if (src.natoSymbols?.length) await this.natoSymbols.bulkPut(src.natoSymbols);
    }

    async clearAll(): Promise<void> {
        const tables = Object.keys(TABLE_SCHEMAS);
        for (const table of tables) {
            this.sqlDb!.run(`DELETE FROM ${table}`);
        }
        this.version++;
        this.listeners.forEach(fn => fn());
        this.scheduleSave();
    }

    async exportRaw(): Promise<Uint8Array> {
        return new Uint8Array(this.sqlDb!.export());
    }

    async importRaw(data: Uint8Array): Promise<void> {
        // Dynamically import sql.js to create a new database from raw bytes
        const initSqlJs: SqlJsStatic = (await import('sql.js')).default;
        const SQL = await initSqlJs({
            locateFile: () => '/sql-wasm.wasm'
        });

        // Close old database
        this.sqlDb?.close();

        // Open the imported file
        this.sqlDb = new SQL.Database(data);

        // Ensure all tables exist (in case the imported file is from an older version)
        this.sqlDb.run(MIGRATIONS_TABLE);
        for (const sql of Object.values(TABLE_SCHEMAS)) {
            this.sqlDb.run(sql);
        }

        // Rewire table adapters
        const getDb = () => this.sqlDb!;
        const notify = () => {
            this.version++;
            this.listeners.forEach(fn => fn());
        };
        const scheduleSave = () => this.scheduleSave();

        this.units = sqliteTable<Unit>(getDb, 'units', TABLE_COLUMNS.units, notify, scheduleSave);
        this.deployments = sqliteTable<Deployment>(getDb, 'deployments', TABLE_COLUMNS.deployments, notify, scheduleSave);
        this.operations = sqliteTable<Operation>(getDb, 'operations', TABLE_COLUMNS.operations, notify, scheduleSave);
        this.missions = sqliteTable<Mission>(getDb, 'missions', TABLE_COLUMNS.missions, notify, scheduleSave);
        this.taskForces = sqliteTable<TaskForce>(getDb, 'taskForces', TABLE_COLUMNS.taskForces, notify, scheduleSave);
        this.mapIcons = sqliteTable<MapIcon>(getDb, 'mapIcons', TABLE_COLUMNS.mapIcons, notify, scheduleSave);
        this.mapPins = sqliteTable<MapPin>(getDb, 'mapPins', TABLE_COLUMNS.mapPins, notify, scheduleSave);
        this.mapShapes = sqliteTable<MapShape>(getDb, 'mapShapes', TABLE_COLUMNS.mapShapes, notify, scheduleSave);
        this.natoSymbols = sqliteTable<NatoSymbol>(getDb, 'natoSymbols', TABLE_COLUMNS.natoSymbols, notify, scheduleSave);

        // Persist and notify
        await this.persistNow();
        this.version++;
        this.listeners.forEach(fn => fn());
    }

    subscribe(callback: () => void): () => void {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    getVersion(): number {
        return this.version;
    }
}
