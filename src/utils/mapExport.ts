import { db } from '../db';

interface MapExportData {
    version: number;
    timestamp: string;
    data: {
        mapIcons: any[];
        mapPins: any[];
        mapShapes: any[];
    };
}

interface ImportResult {
    icons: number;
    pins: number;
    shapes: number;
}

export async function exportMapData(): Promise<void> {
    const mapIcons = await db.mapIcons.toArray();
    const mapPins = await db.mapPins.toArray();
    const mapShapes = await db.mapShapes.toArray();

    const exportData: MapExportData = {
        version: 1,
        timestamp: new Date().toISOString(),
        data: { mapIcons, mapPins, mapShapes }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forcesight-map-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export async function importMapData(file: File): Promise<ImportResult> {
    const text = await file.text();
    const parsed: MapExportData = JSON.parse(text);

    if (!parsed.data || typeof parsed.data !== 'object') {
        throw new Error('Invalid map data file format');
    }

    const { mapIcons = [], mapPins = [], mapShapes = [] } = parsed.data;

    if (mapIcons.length) await db.mapIcons.bulkPut(mapIcons);
    if (mapPins.length) await db.mapPins.bulkPut(mapPins);
    if (mapShapes.length) await db.mapShapes.bulkPut(mapShapes);

    return {
        icons: mapIcons.length,
        pins: mapPins.length,
        shapes: mapShapes.length
    };
}
