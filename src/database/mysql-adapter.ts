import type {
    DatabaseAdapter, TableAdapter, WhereClause, QueryAdapter,
    Unit, Deployment, Operation, Mission, TaskForce,
    MapIcon, MapPin, MapShape, NatoSymbol, BackupData
} from './types';

// ── MySQL REST proxy adapter ──────────────────────────────────────────────────
//
// Connects to a user-provided REST API that proxies MySQL operations.
// The proxy should expose: GET/POST/PUT/DELETE /api/{table}/{id?}
//
// Expected proxy endpoints:
//   GET    /api/units             → returns all rows
//   GET    /api/units/:id         → returns one row
//   POST   /api/units             → insert/replace (body = record)
//   POST   /api/units/bulk        → bulk insert (body = { items: [...] })
//   PUT    /api/units/:id         → partial update (body = { changes })
//   DELETE /api/units/:id         → delete one row
//   DELETE /api/units             → clear table
//   GET    /api/units?field=value → filtered query
//   GET    /api/units?orderBy=x   → ordered query

const TABLE_NAMES = ['units', 'deployments', 'operations', 'missions', 'taskForces', 'mapIcons', 'mapPins', 'mapShapes', 'natoSymbols'] as const;

function mysqlTable<T extends { id: string }>(
    baseUrl: string,
    tableName: string,
    notify: () => void
): TableAdapter<T> {
    const url = (path = '') => `${baseUrl}/api/${tableName}${path}`;

    const fetchJson = async <R = any>(input: string, init?: RequestInit): Promise<R> => {
        const res = await fetch(input, {
            ...init,
            headers: { 'Content-Type': 'application/json', ...init?.headers },
        });
        if (!res.ok) throw new Error(`MySQL proxy error: ${res.status} ${res.statusText}`);
        return res.json();
    };

    return {
        toArray: () => fetchJson<T[]>(url()),

        get: async (id) => {
            try {
                return await fetchJson<T>(url(`/${id}`));
            } catch {
                return undefined;
            }
        },

        put: async (item) => {
            await fetchJson(url(), { method: 'POST', body: JSON.stringify(item) });
            notify();
        },

        bulkPut: async (items) => {
            await fetchJson(url('/bulk'), { method: 'POST', body: JSON.stringify({ items }) });
            notify();
        },

        update: async (id, changes) => {
            await fetchJson(url(`/${id}`), { method: 'PUT', body: JSON.stringify(changes) });
            notify();
        },

        delete: async (id) => {
            await fetchJson(url(`/${id}`), { method: 'DELETE' });
            notify();
        },

        clear: async () => {
            await fetchJson(url(), { method: 'DELETE' });
            notify();
        },

        where: (field) => ({
            equals: (value) => ({
                toArray: () => fetchJson<T[]>(url(`?${field as string}=${encodeURIComponent(String(value))}`)),
                sortBy: async (sortField) => {
                    const items = await fetchJson<T[]>(url(`?${field as string}=${encodeURIComponent(String(value))}&orderBy=${sortField as string}`));
                    return items;
                },
            }),
        }) as WhereClause<T>,

        orderBy: (field) => ({
            toArray: () => fetchJson<T[]>(url(`?orderBy=${field as string}`)),
            sortBy: (sortField) => fetchJson<T[]>(url(`?orderBy=${sortField as string}`)),
        }) as QueryAdapter<T>,
    };
}

// ── MySQL Adapter ─────────────────────────────────────────────────────────────

export class MySQLAdapter implements DatabaseAdapter {
    private baseUrl: string;
    private version = 0;
    private listeners = new Set<() => void>();

    units!: TableAdapter<Unit>;
    deployments!: TableAdapter<Deployment>;
    operations!: TableAdapter<Operation>;
    missions!: TableAdapter<Mission>;
    taskForces!: TableAdapter<TaskForce>;
    mapIcons!: TableAdapter<MapIcon>;
    mapPins!: TableAdapter<MapPin>;
    mapShapes!: TableAdapter<MapShape>;
    natoSymbols!: TableAdapter<NatoSymbol>;

    constructor(mysqlUrl: string) {
        this.baseUrl = mysqlUrl.replace(/\/+$/, '');
    }

    async init(): Promise<void> {
        const notify = () => {
            this.version++;
            this.listeners.forEach(fn => fn());
        };

        this.units = mysqlTable<Unit>(this.baseUrl, 'units', notify);
        this.deployments = mysqlTable<Deployment>(this.baseUrl, 'deployments', notify);
        this.operations = mysqlTable<Operation>(this.baseUrl, 'operations', notify);
        this.missions = mysqlTable<Mission>(this.baseUrl, 'missions', notify);
        this.taskForces = mysqlTable<TaskForce>(this.baseUrl, 'taskForces', notify);
        this.mapIcons = mysqlTable<MapIcon>(this.baseUrl, 'mapIcons', notify);
        this.mapPins = mysqlTable<MapPin>(this.baseUrl, 'mapPins', notify);
        this.mapShapes = mysqlTable<MapShape>(this.baseUrl, 'mapShapes', notify);
        this.natoSymbols = mysqlTable<NatoSymbol>(this.baseUrl, 'natoSymbols', notify);

        // Verify connection by fetching unit count
        try {
            await this.units.toArray();
        } catch (err) {
            throw new Error(`Failed to connect to MySQL proxy at ${this.baseUrl}: ${(err as Error).message}`);
        }
    }

    async close(): Promise<void> {
        // No persistent connection to close
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
        for (const table of TABLE_NAMES) {
            const items = src[table];
            if (items?.length) {
                await (this[table] as TableAdapter<any>).bulkPut(items);
            }
        }
    }

    async clearAll(): Promise<void> {
        for (const table of TABLE_NAMES) {
            await (this[table] as TableAdapter<any>).clear();
        }
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
