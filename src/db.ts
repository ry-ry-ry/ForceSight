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
    taskForceId?: string;
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
    iconId?: string; // references MapIcon.id
    lat: number;
    lng: number;
    description?: string;
    properties?: string; // JSON string for extensibility
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

class DB extends Dexie {
    units!: Table<Unit, string>;
    deployments!: Table<Deployment, string>;
    operations!: Table<Operation, string>;
    missions!: Table<Mission, string>;
    taskForces!: Table<TaskForce, string>;
    mapIcons!: Table<MapIcon, string>;
    mapPins!: Table<MapPin, string>;
    mapShapes!: Table<MapShape, string>;

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
    }
}

export const db = new DB();