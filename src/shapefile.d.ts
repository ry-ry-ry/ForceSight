declare module 'shapefile' {
    interface Feature {
        type: string;
        geometry: {
            type: string;
            coordinates: any;
        };
        properties: Record<string, any>;
    }

    interface Source {
        read(): Promise<{ done: boolean; value: Feature }>;
    }

    export function open(shp: ArrayBuffer, dbf?: ArrayBuffer): Promise<Source>;
}
