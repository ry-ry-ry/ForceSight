import { useSyncExternalStore, useCallback, useRef, useEffect, useState } from 'react';
import type { DatabaseAdapter, BackendType } from './types';
import { getConfig } from './config';

// Re-export all types for convenient imports
export type {
    Unit, Deployment, Operation, Mission, TaskForce,
    MapIcon, MapPin, MapShape, BackupData,
    DatabaseAdapter, TableAdapter, WhereClause, QueryAdapter,
    BackendType
} from './types';

// ── Singleton ─────────────────────────────────────────────────────────────────

let activeAdapter: DatabaseAdapter | null = null;

export function getDb(): DatabaseAdapter {
    if (!activeAdapter) {
        throw new Error('Database not initialised. Call initDb() first.');
    }
    return activeAdapter;
}

/** Convenience proxy so components can write `db.units.toArray()` */
export const db = new Proxy({} as DatabaseAdapter, {
    get(_target, prop) {
        return getDb()[prop as keyof DatabaseAdapter];
    }
});

export async function initDb(backend?: BackendType, mysqlUrl?: string): Promise<DatabaseAdapter> {
    // Close existing adapter if any
    if (activeAdapter) {
        await activeAdapter.close();
        activeAdapter = null;
    }

    const config = getConfig();
    const resolvedBackend = backend ?? config.backend ?? 'indexeddb';

    let adapter: DatabaseAdapter;

    switch (resolvedBackend) {
        case 'sqlite': {
            const { SQLiteAdapter } = await import('./sqlite-adapter');
            adapter = new SQLiteAdapter();
            break;
        }
        case 'mysql': {
            const { MySQLAdapter } = await import('./mysql-adapter');
            const url = mysqlUrl ?? config.mysqlUrl;
            if (!url) throw new Error('MySQL URL not configured');
            adapter = new MySQLAdapter(url);
            break;
        }
        case 'indexeddb':
        default: {
            const { IndexedDBAdapter } = await import('./indexeddb-adapter');
            adapter = new IndexedDBAdapter();
            break;
        }
    }

    await adapter.init();
    activeAdapter = adapter;
    return adapter;
}

export function isDbReady(): boolean {
    return activeAdapter !== null;
}

// ── Reactive hook: useLiveData ────────────────────────────────────────────────
//
// Replaces dexie-react-hooks' `useLiveQuery`.
// Re-runs the query whenever the adapter's version changes (i.e. after any write).

export function useLiveData<T>(
    queryFn: () => Promise<T>,
    deps: any[] = []
): T | undefined {
    const [data, setData] = useState<T | undefined>(undefined);
    const queryRef = useRef(queryFn);
    queryRef.current = queryFn;

    // Track the adapter's version to know when to re-query
    const getSnapshot = useCallback(() => {
        try {
            return getDb().getVersion();
        } catch {
            return -1; // db not ready
        }
    }, []);

    const subscribe = useCallback((onStoreChange: () => void) => {
        try {
            return getDb().subscribe(onStoreChange);
        } catch {
            return () => {};
        }
    }, []);

    const version = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    useEffect(() => {
        let cancelled = false;
        queryRef.current().then(result => {
            if (!cancelled) setData(result);
        }).catch(err => {
            console.error('useLiveData query error:', err);
        });
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [version, ...deps]);

    return data;
}
