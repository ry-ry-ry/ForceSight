import { db } from '../database/adapter';
import { parseKML } from './kmlParser';
import type { ParsedFeature } from './kmlParser';
import { serializeCoordinates, serializeShapeStyle } from './mapDataHelpers';

interface ImportResult {
    pins: number;
    shapes: number;
}

async function readKMZ(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // KMZ is a ZIP file. Find the doc.kml entry.
    // Simple ZIP extraction: look for PK header and find .kml file
    // For robustness, use fflate's unzip
    const { unzipSync } = await import('fflate');
    const unzipped = unzipSync(bytes);

    for (const [name, data] of Object.entries(unzipped)) {
        if (name.endsWith('.kml')) {
            return new TextDecoder().decode(data);
        }
    }

    throw new Error('No .kml file found in KMZ archive');
}

async function parseShapefile(files: File[]): Promise<ParsedFeature[]> {
    const shpFile = files.find(f => f.name.endsWith('.shp'));
    const dbfFile = files.find(f => f.name.endsWith('.dbf'));

    if (!shpFile) throw new Error('No .shp file found');

    // Dynamic import of shapefile library
    const shapefile = await import('shapefile');

    const shpBuffer = await shpFile.arrayBuffer();
    const dbfBuffer = dbfFile ? await dbfFile.arrayBuffer() : undefined;

    const source = await shapefile.open(shpBuffer, dbfBuffer);
    const features: ParsedFeature[] = [];

    let result = await source.read();
    while (!result.done) {
        const feature = result.value;
        const geom = feature.geometry;
        const name = feature.properties?.NAME || feature.properties?.name || feature.properties?.Name || 'Unnamed';

        if (geom.type === 'Point') {
            const [lng, lat] = geom.coordinates;
            features.push({
                name,
                type: 'point',
                coordinates: [[lat, lng]],
                style: { color: '#00d9ff', fillOpacity: 0.3, lineWidth: 2 }
            });
        } else if (geom.type === 'MultiPoint') {
            geom.coordinates.forEach((coord: number[], i: number) => {
                features.push({
                    name: `${name} ${i + 1}`,
                    type: 'point',
                    coordinates: [[coord[1], coord[0]]],
                    style: { color: '#00d9ff', fillOpacity: 0.3, lineWidth: 2 }
                });
            });
        } else if (geom.type === 'LineString') {
            const coords: [number, number][] = geom.coordinates.map((c: number[]) => [c[1], c[0]]);
            features.push({
                name,
                type: 'polyline',
                coordinates: coords,
                style: { color: '#00d9ff', fillOpacity: 0.3, lineWidth: 2 }
            });
        } else if (geom.type === 'MultiLineString') {
            geom.coordinates.forEach((line: number[][], i: number) => {
                const coords: [number, number][] = line.map(c => [c[1], c[0]]);
                features.push({
                    name: geom.coordinates.length > 1 ? `${name} ${i + 1}` : name,
                    type: 'polyline',
                    coordinates: coords,
                    style: { color: '#00d9ff', fillOpacity: 0.3, lineWidth: 2 }
                });
            });
        } else if (geom.type === 'Polygon') {
            // Use first (outer) ring
            const coords: [number, number][] = geom.coordinates[0].map((c: number[]) => [c[1], c[0]]);
            features.push({
                name,
                type: 'polygon',
                coordinates: coords,
                style: { color: '#00d9ff', fillOpacity: 0.3, lineWidth: 2 }
            });
        } else if (geom.type === 'MultiPolygon') {
            geom.coordinates.forEach((poly: number[][][], i: number) => {
                const coords: [number, number][] = poly[0].map(c => [c[1], c[0]]);
                features.push({
                    name: geom.coordinates.length > 1 ? `${name} ${i + 1}` : name,
                    type: 'polygon',
                    coordinates: coords,
                    style: { color: '#00d9ff', fillOpacity: 0.3, lineWidth: 2 }
                });
            });
        }

        result = await source.read();
    }

    return features;
}

async function featuresToDb(features: ParsedFeature[]): Promise<ImportResult> {
    let pins = 0;
    let shapes = 0;

    const pinEntries = [];
    const shapeEntries = [];

    for (const feature of features) {
        if (feature.type === 'point' && feature.coordinates.length > 0) {
            pinEntries.push({
                id: crypto.randomUUID(),
                name: feature.name,
                lat: feature.coordinates[0][0],
                lng: feature.coordinates[0][1],
                createdAt: Date.now()
            });
            pins++;
        } else if (feature.type === 'polyline' || feature.type === 'polygon') {
            shapeEntries.push({
                id: crypto.randomUUID(),
                name: feature.name,
                type: feature.type as 'polygon' | 'polyline',
                coordinates: serializeCoordinates(feature.coordinates),
                style: serializeShapeStyle(feature.style),
                createdAt: Date.now()
            });
            shapes++;
        }
    }

    if (pinEntries.length) await db.mapPins.bulkPut(pinEntries);
    if (shapeEntries.length) await db.mapShapes.bulkPut(shapeEntries);

    return { pins, shapes };
}

export async function importGeoFile(files: File[]): Promise<ImportResult> {
    const kmlFile = files.find(f => f.name.endsWith('.kml'));
    const kmzFile = files.find(f => f.name.endsWith('.kmz'));
    const shpFile = files.find(f => f.name.endsWith('.shp'));

    if (kmlFile) {
        const text = await kmlFile.text();
        const features = parseKML(text);
        return featuresToDb(features);
    }

    if (kmzFile) {
        const kmlText = await readKMZ(kmzFile);
        const features = parseKML(kmlText);
        return featuresToDb(features);
    }

    if (shpFile) {
        const features = await parseShapefile(files);
        return featuresToDb(features);
    }

    throw new Error('No supported file format found. Supported: .kml, .kmz, .shp');
}
