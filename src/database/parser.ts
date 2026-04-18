import type { BackupData, Unit, Deployment, Operation, Mission, SubOperation, TaskForce, MapIcon, MapPin, MapShape, NatoSymbol } from './types';

/**
 * Parse any ForceSight backup JSON (v1–current) into a normalised BackupData.
 * Handles missing tables/fields from older versions by applying defaults.
 */
export function parseBackup(raw: string): BackupData {
    let parsed: any;
    try {
        parsed = JSON.parse(raw);
    } catch {
        throw new Error('Invalid JSON: the file is not a valid ForceSight backup.');
    }

    // Validate structure
    if (!parsed.data || typeof parsed.data !== 'object') {
        throw new Error('Invalid backup format: missing "data" field.');
    }

    const version = parsed.version ?? 1;
    const d = parsed.data;

    return {
        version: 8, // normalised to current
        timestamp: parsed.timestamp || new Date().toISOString(),
        data: {
            units: normaliseUnits(d.units || [], version),
            deployments: normaliseDeployments(d.deployments || [], version),
            operations: normaliseOperations(d.operations || []),
            missions: normaliseMissions(d.missions || []),
            subOperations: normaliseSubOperations(d.subOperations || []),
            taskForces: normaliseTaskForces(d.taskForces || []),
            mapIcons: normaliseMapIcons(d.mapIcons || []),
            mapPins: normaliseMapPins(d.mapPins || []),
            mapShapes: normaliseMapShapes(d.mapShapes || []),
            natoSymbols: normaliseNatoSymbols(d.natoSymbols || []),
        }
    };
}

/**
 * Get a human-readable summary of a parsed backup for the import preview.
 */
export function getBackupSummary(data: BackupData): string[] {
    const lines: string[] = [];
    const d = data.data;

    if (d.units.length) lines.push(`${d.units.length} units`);
    if (d.deployments.length) lines.push(`${d.deployments.length} deployments`);
    if (d.operations.length) lines.push(`${d.operations.length} operations`);
    if (d.missions.length) lines.push(`${d.missions.length} missions`);
    if (d.subOperations?.length) lines.push(`${d.subOperations.length} sub-operations`);
    if (d.taskForces.length) lines.push(`${d.taskForces.length} task forces`);
    if (d.mapIcons.length) lines.push(`${d.mapIcons.length} map icons`);
    if (d.mapPins.length) lines.push(`${d.mapPins.length} map pins`);
    if (d.mapShapes.length) lines.push(`${d.mapShapes.length} map shapes`);
    if (d.natoSymbols?.length) lines.push(`${d.natoSymbols.length} NATO symbols`);

    if (lines.length === 0) lines.push('Empty backup');

    return lines;
}

// ── Normalisation functions ───────────────────────────────────────────────────

function normaliseUnits(raw: any[], _backupVersion: number): Unit[] {
    return raw.map(u => {
        const unit: Unit = {
            id: u.id || crypto.randomUUID(),
            name: u.name || 'Unnamed Unit',
            type: u.type || 'Ground',
            status: u.status || 'Standby',
            createdAt: u.createdAt || Date.now(),
        };

        // Fields added in various versions — apply if present
        if (u.echelon) unit.echelon = u.echelon;             // v3+
        if (u.country) unit.country = u.country;             // v5+
        if (u.parentId) unit.parentId = u.parentId;          // v2+
        if (u.taskForceId) unit.taskForceId = u.taskForceId; // v6+
        if (u.lastRTBDate) unit.lastRTBDate = u.lastRTBDate;
        if (u.locationLat !== undefined) unit.locationLat = u.locationLat;
        if (u.locationLng !== undefined) unit.locationLng = u.locationLng;
        if (u.patch) unit.patch = u.patch;

        // v8+ fields
        if (u.health) unit.health = u.health;
        if (u.effectiveness !== undefined) unit.effectiveness = u.effectiveness;

        // v9+ NATO symbol fields
        if (u.natoSymbol) unit.natoSymbol = u.natoSymbol;
        if (u.affiliation) unit.affiliation = u.affiliation;
        if (u.sizeSymbolOverride) unit.sizeSymbolOverride = u.sizeSymbolOverride;

        return unit;
    });
}

function normaliseDeployments(raw: any[], _backupVersion: number): Deployment[] {
    return raw.map(d => {
        const dep: Deployment = {
            id: d.id || crypto.randomUUID(),
            unitId: d.unitId,
            name: d.name || 'Unnamed Deployment',
            startDate: d.startDate || new Date().toISOString().slice(0, 10),
        };

        if (d.operation) dep.operation = d.operation;
        if (d.operationId) dep.operationId = d.operationId; // v4+
        if (d.endDate) dep.endDate = d.endDate;

        return dep;
    });
}

function normaliseOperations(raw: any[]): Operation[] {
    return raw.map(o => ({
        id: o.id || crypto.randomUUID(),
        name: o.name || 'Unnamed Operation',
        type: o.type || 'Other',
        description: o.description,
        startDate: o.startDate || new Date().toISOString().slice(0, 10),
        endDate: o.endDate,
        status: o.status || 'Active',
        createdAt: o.createdAt || Date.now(),
    }));
}

function normaliseMissions(raw: any[]): Mission[] {
    return raw.map(m => ({
        id: m.id || crypto.randomUUID(),
        unitId: m.unitId,
        operationId: m.operationId,
        subOperationId: m.subOperationId,
        name: m.name || 'Unnamed Mission',
        type: m.type || 'Other',
        startDate: m.startDate || new Date().toISOString().slice(0, 10),
        endDate: m.endDate,
        description: m.description,
    }));
}

function normaliseSubOperations(raw: any[]): SubOperation[] {
    return raw
        .filter(so => so && so.parentOperationId)
        .map(so => ({
            id: so.id || crypto.randomUUID(),
            parentOperationId: so.parentOperationId,
            name: so.name || 'Unnamed Sub-Operation',
            type: so.type || 'Other',
            description: so.description,
            startDate: so.startDate || new Date().toISOString().slice(0, 10),
            endDate: so.endDate,
            status: so.status || 'Active',
            createdAt: so.createdAt || Date.now(),
        }));
}

function normaliseTaskForces(raw: any[]): TaskForce[] {
    return raw.map(tf => ({
        id: tf.id || crypto.randomUUID(),
        name: tf.name || 'Unnamed Task Force',
        operationId: tf.operationId,
        description: tf.description,
        createdAt: tf.createdAt || Date.now(),
    }));
}

function normaliseMapIcons(raw: any[]): MapIcon[] {
    return raw.map(i => ({
        id: i.id || crypto.randomUUID(),
        name: i.name || 'Unnamed Icon',
        image: i.image || '',
        createdAt: i.createdAt || Date.now(),
    }));
}

function normaliseMapPins(raw: any[]): MapPin[] {
    return raw.map(p => ({
        id: p.id || crypto.randomUUID(),
        name: p.name || 'Unnamed Pin',
        iconId: p.iconId,
        lat: p.lat ?? 0,
        lng: p.lng ?? 0,
        description: p.description,
        properties: p.properties,
        createdAt: p.createdAt || Date.now(),
    }));
}

function normaliseMapShapes(raw: any[]): MapShape[] {
    return raw.map(s => ({
        id: s.id || crypto.randomUUID(),
        name: s.name || 'Unnamed Shape',
        type: s.type || 'polygon',
        coordinates: s.coordinates || '[]',
        style: s.style || '{"color":"#00d9ff","fillOpacity":0.3,"lineWidth":2}',
        description: s.description,
        createdAt: s.createdAt || Date.now(),
    }));
}

function normaliseNatoSymbols(raw: any[]): NatoSymbol[] {
    return raw.map(ns => ({
        id: ns.id || crypto.randomUUID(),
        name: ns.name || 'Unnamed Symbol',
        code: ns.code,
        image: ns.image || '',
        createdAt: ns.createdAt || Date.now(),
    }));
}
