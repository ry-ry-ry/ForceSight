export interface ShapeStyle {
    color: string;
    fillOpacity: number;
    lineWidth: number;
}

export const DEFAULT_SHAPE_STYLE: ShapeStyle = {
    color: '#00d9ff',
    fillOpacity: 0.3,
    lineWidth: 2
};

export function parseCoordinates(json: string): [number, number][] {
    try {
        return JSON.parse(json);
    } catch {
        return [];
    }
}

export function serializeCoordinates(coords: [number, number][]): string {
    return JSON.stringify(coords);
}

export function parseShapeStyle(json: string): ShapeStyle {
    try {
        const parsed = JSON.parse(json);
        return {
            color: parsed.color || DEFAULT_SHAPE_STYLE.color,
            fillOpacity: parsed.fillOpacity ?? DEFAULT_SHAPE_STYLE.fillOpacity,
            lineWidth: parsed.lineWidth ?? DEFAULT_SHAPE_STYLE.lineWidth
        };
    } catch {
        return { ...DEFAULT_SHAPE_STYLE };
    }
}

export function serializeShapeStyle(style: ShapeStyle): string {
    return JSON.stringify(style);
}

/**
 * Convert a CSS hex color (#rrggbb or #rrggbbaa) to a Cesium RGBA array [r, g, b, a] (0-255).
 */
export function hexToRgba(hex: string, alpha: number = 1): [number, number, number, number] {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    const a = clean.length >= 8
        ? parseInt(clean.substring(6, 8), 16) / 255
        : alpha;
    return [r, g, b, Math.round(a * 255)];
}
