import Dexie from 'dexie';
import type { Table } from 'dexie';
import type {
    DatabaseAdapter, TableAdapter, WhereClause, QueryAdapter,
    Unit, Deployment, Operation, Mission, TaskForce,
    MapIcon, MapPin, MapShape, NatoSymbol, BackupData
} from './types';

// ── Dexie schema (preserves all existing versions for seamless upgrade) ───────

class ForceSightDexie extends Dexie {
    units!: Table<Unit, string>;
    deployments!: Table<Deployment, string>;
    operations!: Table<Operation, string>;
    missions!: Table<Mission, string>;
    taskForces!: Table<TaskForce, string>;
    mapIcons!: Table<MapIcon, string>;
    mapPins!: Table<MapPin, string>;
    mapShapes!: Table<MapShape, string>;
    natoSymbols!: Table<NatoSymbol, string>;

    constructor() {
        super('unitDB');
        this.version(1).stores({ units: 'id, name', deployments: 'id, unitId' });
        this.version(2).stores({ units: 'id, name, parentId', deployments: 'id, unitId' });
        this.version(3).stores({ units: 'id, name, parentId, echelon', deployments: 'id, unitId' });
        this.version(4).stores({
            units: 'id, name, parentId, echelon',
            deployments: 'id, unitId, operationId',
            operations: 'id, name, status, startDate',
            missions: 'id, unitId, operationId'
        });
        this.version(5).stores({
            units: 'id, name, parentId, echelon, country',
            deployments: 'id, unitId, operationId',
            operations: 'id, name, status, startDate',
            missions: 'id, unitId, operationId'
        });
        this.version(6).stores({
            units: 'id, name, parentId, echelon, country, taskForceId',
            deployments: 'id, unitId, operationId',
            operations: 'id, name, status, startDate',
            missions: 'id, unitId, operationId',
            taskForces: 'id, name, operationId'
        });
        this.version(7).stores({
            units: 'id, name, parentId, echelon, country, taskForceId',
            deployments: 'id, unitId, operationId',
            operations: 'id, name, status, startDate',
            missions: 'id, unitId, operationId',
            taskForces: 'id, name, operationId',
            mapIcons: 'id, name',
            mapPins: 'id, name, iconId',
            mapShapes: 'id, name, type'
        });
        this.version(8).stores({
            units: 'id, name, parentId, echelon, country, taskForceId',
            deployments: 'id, unitId, operationId',
            operations: 'id, name, status, startDate',
            missions: 'id, unitId, operationId',
            taskForces: 'id, name, operationId',
            mapIcons: 'id, name',
            mapPins: 'id, name, iconId',
            mapShapes: 'id, name, type'
        });
        this.version(9).stores({
            units: 'id, name, parentId, echelon, country, taskForceId',
            deployments: 'id, unitId, operationId',
            operations: 'id, name, status, startDate',
            missions: 'id, unitId, operationId',
            taskForces: 'id, name, operationId',
            mapIcons: 'id, name',
            mapPins: 'id, name, iconId',
            mapShapes: 'id, name, type',
            natoSymbols: 'id, name'
        });
        this.version(10).stores({
            units: 'id, name, parentId, echelon, country, taskForceId, baseId',
            deployments: 'id, unitId, operationId',
            operations: 'id, name, status, startDate',
            missions: 'id, unitId, operationId',
            taskForces: 'id, name, operationId',
            mapIcons: 'id, name',
            mapPins: 'id, name, iconId',
            mapShapes: 'id, name, type',
            natoSymbols: 'id, name'
        });
    }
}

// ── Dexie table → TableAdapter wrapper ────────────────────────────────────────

function wrapTable<T extends { id: string }>(
    table: Table<T, string>,
    notify: () => void
): TableAdapter<T> {
    return {
        toArray: () => table.toArray(),
        get: (id) => table.get(id),
        put: async (item) => { await table.put(item); notify(); },
        bulkPut: async (items) => { await table.bulkPut(items); notify(); },
        update: async (id, changes) => { await table.update(id, changes as any); notify(); },
        delete: async (id) => { await table.delete(id); notify(); },
        clear: async () => { await table.clear(); notify(); },
        where: (field) => wrapWhere(table, field as string),
        orderBy: (field) => wrapOrderBy(table, field as string),
    };
}

function wrapWhere<T>(table: Table<T, string>, field: string): WhereClause<T> {
    return {
        equals: (value) => wrapQuery(table.where(field).equals(value as any)),
    };
}

function wrapQuery<T>(collection: ReturnType<Table<T, string>['where']> extends Dexie.Collection<infer C, any> ? Dexie.Collection<C, any> : any): QueryAdapter<T> {
    return {
        toArray: () => collection.toArray(),
        sortBy: (field: any) => collection.sortBy(field as string),
    };
}

function wrapOrderBy<T>(table: Table<T, string>, field: string): QueryAdapter<T> {
    return {
        toArray: () => table.orderBy(field).toArray(),
        sortBy: (sortField: any) => table.orderBy(field).sortBy(sortField as string),
    };
}

// ── IndexedDB Adapter ─────────────────────────────────────────────────────────

export class IndexedDBAdapter implements DatabaseAdapter {
    private dexie: ForceSightDexie | null = null;
    private version = 0;
    private listeners = new Set<() => void>();

    // Table adapters (set in init)
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
        this.dexie = new ForceSightDexie();
        await this.dexie.open();

        const notify = () => {
            this.version++;
            this.listeners.forEach(fn => fn());
        };

        this.units = wrapTable(this.dexie.units, notify);
        this.deployments = wrapTable(this.dexie.deployments, notify);
        this.operations = wrapTable(this.dexie.operations, notify);
        this.missions = wrapTable(this.dexie.missions, notify);
        this.taskForces = wrapTable(this.dexie.taskForces, notify);
        this.mapIcons = wrapTable(this.dexie.mapIcons, notify);
        this.mapPins = wrapTable(this.dexie.mapPins, notify);
        this.mapShapes = wrapTable(this.dexie.mapShapes, notify);
        this.natoSymbols = wrapTable(this.dexie.natoSymbols, notify);
    }

    async close(): Promise<void> {
        this.dexie?.close();
        this.dexie = null;
    }

    async exportAll(): Promise<BackupData> {
        const d = this.dexie!;
        return {
            version: 7,
            timestamp: new Date().toISOString(),
            data: {
                units: await d.units.toArray(),
                deployments: await d.deployments.toArray(),
                operations: await d.operations.toArray(),
                missions: await d.missions.toArray(),
                taskForces: await d.taskForces.toArray(),
                mapIcons: await d.mapIcons.toArray(),
                mapPins: await d.mapPins.toArray(),
                mapShapes: await d.mapShapes.toArray(),
                natoSymbols: await d.natoSymbols.toArray(),
            }
        };
    }

    async importAll(data: BackupData, mode: 'replace' | 'merge'): Promise<void> {
        const d = this.dexie!;
        const src = data.data;

        await d.transaction('rw',
            [d.units, d.deployments, d.operations, d.missions, d.taskForces,
             d.mapIcons, d.mapPins, d.mapShapes, d.natoSymbols],
            async () => {
                if (mode === 'replace') {
                    await d.units.clear();
                    await d.deployments.clear();
                    await d.operations.clear();
                    await d.missions.clear();
                    await d.taskForces.clear();
                    await d.mapIcons.clear();
                    await d.mapPins.clear();
                    await d.mapShapes.clear();
                    await d.natoSymbols.clear();
                }

                if (src.units?.length) await d.units.bulkPut(src.units);
                if (src.deployments?.length) await d.deployments.bulkPut(src.deployments);
                if (src.operations?.length) await d.operations.bulkPut(src.operations);
                if (src.missions?.length) await d.missions.bulkPut(src.missions);
                if (src.taskForces?.length) await d.taskForces.bulkPut(src.taskForces);
                if (src.mapIcons?.length) await d.mapIcons.bulkPut(src.mapIcons);
                if (src.mapPins?.length) await d.mapPins.bulkPut(src.mapPins);
                if (src.mapShapes?.length) await d.mapShapes.bulkPut(src.mapShapes);
                if (src.natoSymbols?.length) await d.natoSymbols.bulkPut(src.natoSymbols);
            }
        );

        this.version++;
        this.listeners.forEach(fn => fn());
    }

    async clearAll(): Promise<void> {
        const d = this.dexie!;
        await d.transaction('rw',
            [d.units, d.deployments, d.operations, d.missions, d.taskForces,
             d.mapIcons, d.mapPins, d.mapShapes, d.natoSymbols],
            async () => {
                await d.units.clear();
                await d.deployments.clear();
                await d.operations.clear();
                await d.missions.clear();
                await d.taskForces.clear();
                await d.mapIcons.clear();
                await d.mapPins.clear();
                await d.mapShapes.clear();
                await d.natoSymbols.clear();
            }
        );
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
