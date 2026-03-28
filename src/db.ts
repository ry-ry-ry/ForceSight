import Dexie from 'dexie';
import type { Table } from 'dexie';

export interface Unit {
    id: string;
    name: string;
    type: string;
    echelon?: string;
    country?: string;
    status: string;
    parentId?: string;
    lastRTBDate?: string;
    locationLat?: number;
    locationLng?: number;
    patch?: string; // base64 encoded image
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

class DB extends Dexie {
    units!: Table<Unit, string>;
    deployments!: Table<Deployment, string>;
    operations!: Table<Operation, string>;
    missions!: Table<Mission, string>;

    constructor() {
        super('unitDB');
        this.version(1).stores({
            units: 'id, name',
            deployments: 'id, unitId'
        });
        this.version(2).stores({
            units: 'id, name, parentId',
            deployments: 'id, unitId'
        });
        this.version(3).stores({
            units: 'id, name, parentId, echelon',
            deployments: 'id, unitId'
        });
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
    }
}

export const db = new DB();