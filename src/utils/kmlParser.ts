/**
 * Parse KML XML and extract placemarks with geometry and styles.
 */

interface ParsedFeature {
    name: string;
    type: 'point' | 'polyline' | 'polygon';
    coordinates: [number, number][]; // [lat, lng]
    style: {
        color: string;
        fillOpacity: number;
        lineWidth: number;
    };
}

/**
 * Convert KML aabbggrr color format to CSS #rrggbb hex.
 */
function kmlColorToHex(kmlColor: string): { color: string; opacity: number } {
    // KML colors are aabbggrr
    const clean = kmlColor.replace('#', '');
    if (clean.length !== 8) return { color: '#00d9ff', opacity: 1 };

    const a = parseInt(clean.substring(0, 2), 16) / 255;
    const b = clean.substring(2, 4);
    const g = clean.substring(4, 6);
    const r = clean.substring(6, 8);

    return {
        color: `#${r}${g}${b}`,
        opacity: Math.round(a * 100) / 100
    };
}

function parseCoordinateString(coordStr: string): [number, number][] {
    return coordStr
        .trim()
        .split(/\s+/)
        .map(c => c.trim())
        .filter(c => c.length > 0)
        .map(coord => {
            const [lng, lat] = coord.split(',').map(Number);
            return [lat, lng] as [number, number];
        })
        .filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));
}

export function parseKML(xmlText: string): ParsedFeature[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const features: ParsedFeature[] = [];

    // Collect style definitions
    const styleMap = new Map<string, { color: string; opacity: number; lineWidth: number }>();
    doc.querySelectorAll('Style').forEach(style => {
        const id = style.getAttribute('id');
        if (!id) return;

        let color = '#00d9ff';
        let opacity = 1;
        let lineWidth = 2;

        const lineStyle = style.querySelector('LineStyle');
        if (lineStyle) {
            const colorEl = lineStyle.querySelector('color');
            if (colorEl?.textContent) {
                const parsed = kmlColorToHex(colorEl.textContent);
                color = parsed.color;
                opacity = parsed.opacity;
            }
            const widthEl = lineStyle.querySelector('width');
            if (widthEl?.textContent) {
                lineWidth = parseFloat(widthEl.textContent) || 2;
            }
        }

        const polyStyle = style.querySelector('PolyStyle');
        if (polyStyle) {
            const colorEl = polyStyle.querySelector('color');
            if (colorEl?.textContent) {
                const parsed = kmlColorToHex(colorEl.textContent);
                color = parsed.color;
                opacity = parsed.opacity;
            }
        }

        styleMap.set(`#${id}`, { color, opacity, lineWidth });
    });

    // Parse placemarks
    doc.querySelectorAll('Placemark').forEach(pm => {
        const name = pm.querySelector('name')?.textContent || 'Unnamed';

        // Resolve style
        let style = { color: '#00d9ff', fillOpacity: 0.3, lineWidth: 2 };
        const styleUrl = pm.querySelector('styleUrl')?.textContent;
        if (styleUrl && styleMap.has(styleUrl)) {
            const s = styleMap.get(styleUrl)!;
            style = { color: s.color, fillOpacity: s.opacity, lineWidth: s.lineWidth };
        }
        const inlineStyle = pm.querySelector('Style');
        if (inlineStyle) {
            const lineStyle = inlineStyle.querySelector('LineStyle');
            if (lineStyle) {
                const colorEl = lineStyle.querySelector('color');
                if (colorEl?.textContent) {
                    const parsed = kmlColorToHex(colorEl.textContent);
                    style.color = parsed.color;
                }
                const widthEl = lineStyle.querySelector('width');
                if (widthEl?.textContent) {
                    style.lineWidth = parseFloat(widthEl.textContent) || 2;
                }
            }
        }

        // Point
        const point = pm.querySelector('Point > coordinates');
        if (point?.textContent) {
            const coords = parseCoordinateString(point.textContent);
            if (coords.length > 0) {
                features.push({ name, type: 'point', coordinates: coords, style });
            }
            return;
        }

        // LineString
        const lineString = pm.querySelector('LineString > coordinates');
        if (lineString?.textContent) {
            const coords = parseCoordinateString(lineString.textContent);
            if (coords.length >= 2) {
                features.push({ name, type: 'polyline', coordinates: coords, style });
            }
            return;
        }

        // Polygon (outer boundary)
        const polygon = pm.querySelector('Polygon outerBoundaryIs LinearRing coordinates');
        if (polygon?.textContent) {
            const coords = parseCoordinateString(polygon.textContent);
            if (coords.length >= 3) {
                features.push({ name, type: 'polygon', coordinates: coords, style });
            }
        }
    });

    return features;
}

export type { ParsedFeature };
