import { useRef, useEffect, useState } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { getCesiumToken } from '../utils/cesiumToken';
import { parseCoordinates, parseShapeStyle, hexToRgba } from '../utils/mapDataHelpers';
import type { Unit, MapPin, MapShape, MapIcon } from '../db';

const DEFAULT_PIN_SVG = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 24 16 24s16-12 16-24C32 7.2 24.8 0 16 0zm0 22a6 6 0 110-12 6 6 0 010 12z" fill="#00d9ff"/></svg>`)}`;
const DARK_TILES_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

interface CesiumMapProps {
    units?: Unit[];
    mapPins?: MapPin[];
    mapShapes?: MapShape[];
    mapIcons?: MapIcon[];
    selectedUnitId?: string;
    onClickLocation?: (lat: number, lng: number) => void;
    flyToTarget?: { lat: number; lng: number; altitude?: number } | null;
    showTerrain?: boolean;
    darkMode?: boolean;
    show3DBuildings?: boolean;
    style?: React.CSSProperties;
}

export default function CesiumMap({
    units,
    mapPins,
    mapShapes,
    mapIcons,
    selectedUnitId,
    onClickLocation,
    flyToTarget,
    showTerrain = true,
    darkMode = true,
    show3DBuildings = false,
    style
}: CesiumMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const entitiesRef = useRef<Map<string, Cesium.Entity>>(new Map());
    const buildingsRef = useRef<Cesium.Cesium3DTileset | null>(null);
    const [ready, setReady] = useState(false);

    // Initialize viewer once
    useEffect(() => {
        if (!containerRef.current) return;

        const token = getCesiumToken();
        if (token) {
            Cesium.Ion.defaultAccessToken = token;
        }

        const viewer = new Cesium.Viewer(containerRef.current, {
            timeline: false,
            animation: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            fullscreenButton: false,
            selectionIndicator: false,
            infoBox: false,
            scene3DOnly: false,
            // Start with dark tiles
            baseLayer: Cesium.ImageryLayer.fromProviderAsync(
                Promise.resolve(new Cesium.UrlTemplateImageryProvider({
                    url: DARK_TILES_URL,
                    subdomains: 'abcd',
                    maximumLevel: 18,
                    credit: new Cesium.Credit('CartoDB')
                }))
            )
        });

        // Hide the credit display
        (viewer.creditDisplay.container as HTMLElement).style.display = 'none';

        viewerRef.current = viewer;
        setReady(true);

        return () => {
            if (!viewer.isDestroyed()) {
                viewer.destroy();
            }
            viewerRef.current = null;
            entitiesRef.current.clear();
            setReady(false);
        };
    }, []);

    // Handle terrain toggle
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer || viewer.isDestroyed()) return;

        if (showTerrain) {
            viewer.scene.setTerrain(Cesium.Terrain.fromWorldTerrain());
        } else {
            viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        }
    }, [showTerrain, ready]);

    // Handle dark/light imagery
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer || viewer.isDestroyed()) return;

        const layers = viewer.imageryLayers;
        layers.removeAll();

        if (darkMode) {
            layers.addImageryProvider(
                new Cesium.UrlTemplateImageryProvider({
                    url: DARK_TILES_URL,
                    subdomains: 'abcd',
                    maximumLevel: 18,
                    credit: new Cesium.Credit('CartoDB')
                })
            );
        } else {
            Cesium.IonImageryProvider.fromAssetId(2).then(provider => {
                if (!viewer.isDestroyed()) {
                    layers.addImageryProvider(provider);
                }
            }).catch(() => {});
        }
    }, [darkMode, ready]);

    // Handle 3D buildings
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer || viewer.isDestroyed()) return;

        if (show3DBuildings && !buildingsRef.current) {
            Cesium.createOsmBuildingsAsync().then(tileset => {
                if (!viewer.isDestroyed()) {
                    buildingsRef.current = viewer.scene.primitives.add(tileset) as Cesium.Cesium3DTileset;
                }
            }).catch(() => {});
        } else if (!show3DBuildings && buildingsRef.current) {
            if (!viewer.isDestroyed()) {
                viewer.scene.primitives.remove(buildingsRef.current);
                buildingsRef.current = null;
            }
        }
    }, [show3DBuildings, ready]);

    // Handle click
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer || viewer.isDestroyed() || !onClickLocation) return;

        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((click: { position: Cesium.Cartesian2 }) => {
            const ray = viewer.camera.getPickRay(click.position);
            if (!ray) return;
            const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
            if (!cartesian) return;
            const carto = Cesium.Cartographic.fromCartesian(cartesian);
            onClickLocation(
                Cesium.Math.toDegrees(carto.latitude),
                Cesium.Math.toDegrees(carto.longitude)
            );
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        return () => {
            if (!handler.isDestroyed()) handler.destroy();
        };
    }, [onClickLocation, ready]);

    // Handle fly-to
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer || viewer.isDestroyed() || !flyToTarget) return;

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
                flyToTarget.lng,
                flyToTarget.lat,
                flyToTarget.altitude || 50000
            ),
            duration: 1.5
        });
    }, [flyToTarget]);

    // Sync entities (units, pins, shapes) to the viewer
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer || viewer.isDestroyed()) return;

        const existing = entitiesRef.current;
        const nextIds = new Set<string>();

        // --- Units ---
        const visibleUnits = units?.filter(u => u.locationLat != null && u.locationLng != null) || [];
        for (const unit of visibleUnits) {
            const eid = `unit-${unit.id}`;
            nextIds.add(eid);

            const position = Cesium.Cartesian3.fromDegrees(unit.locationLng!, unit.locationLat!);
            const image = unit.patch || DEFAULT_PIN_SVG;
            const size = unit.id === selectedUnitId ? 44 : 36;

            if (existing.has(eid)) {
                const entity = existing.get(eid)!;
                entity.position = new Cesium.ConstantPositionProperty(position);
                if (entity.billboard) {
                    entity.billboard.image = new Cesium.ConstantProperty(image);
                    entity.billboard.width = new Cesium.ConstantProperty(size);
                    entity.billboard.height = new Cesium.ConstantProperty(size);
                }
            } else {
                const entity = viewer.entities.add({
                    id: eid,
                    name: unit.name,
                    position,
                    billboard: {
                        image,
                        width: size,
                        height: size,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                    }
                });
                existing.set(eid, entity);
            }
        }

        // --- Map Pins ---
        const visiblePins = mapPins || [];
        for (const pin of visiblePins) {
            const eid = `pin-${pin.id}`;
            nextIds.add(eid);

            let pinImage = DEFAULT_PIN_SVG;
            if (pin.iconId && mapIcons) {
                const icon = mapIcons.find(i => i.id === pin.iconId);
                if (icon) pinImage = icon.image;
            }

            const position = Cesium.Cartesian3.fromDegrees(pin.lng, pin.lat);

            if (existing.has(eid)) {
                const entity = existing.get(eid)!;
                entity.position = new Cesium.ConstantPositionProperty(position);
                if (entity.billboard) {
                    entity.billboard.image = new Cesium.ConstantProperty(pinImage);
                }
            } else {
                const entity = viewer.entities.add({
                    id: eid,
                    name: pin.name,
                    position,
                    billboard: {
                        image: pinImage,
                        width: 32,
                        height: 32,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                    }
                });
                existing.set(eid, entity);
            }
        }

        // --- Map Shapes ---
        const visibleShapes = mapShapes || [];
        for (const shape of visibleShapes) {
            const eid = `shape-${shape.id}`;
            nextIds.add(eid);

            if (existing.has(eid)) continue; // shapes don't change often, skip update

            const coords = parseCoordinates(shape.coordinates);
            const shapeStyle = parseShapeStyle(shape.style);
            const [r, g, b, a] = hexToRgba(shapeStyle.color, shapeStyle.fillOpacity);
            const fillColor = new Cesium.Color(r / 255, g / 255, b / 255, a / 255);
            const outlineColor = new Cesium.Color(r / 255, g / 255, b / 255, 1);

            if (shape.type === 'polygon' && coords.length >= 3) {
                const entity = viewer.entities.add({
                    id: eid,
                    name: shape.name,
                    polygon: {
                        hierarchy: Cesium.Cartesian3.fromDegreesArray(coords.flatMap(([lat, lng]) => [lng, lat])),
                        material: fillColor,
                        outline: true,
                        outlineColor,
                        outlineWidth: shapeStyle.lineWidth,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                    }
                });
                existing.set(eid, entity);
            } else if (shape.type === 'polyline' && coords.length >= 2) {
                const entity = viewer.entities.add({
                    id: eid,
                    name: shape.name,
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArray(coords.flatMap(([lat, lng]) => [lng, lat])),
                        material: outlineColor,
                        width: shapeStyle.lineWidth,
                        clampToGround: true
                    }
                });
                existing.set(eid, entity);
            }
        }

        // Remove stale entities
        for (const [eid, entity] of existing) {
            if (!nextIds.has(eid)) {
                viewer.entities.remove(entity);
                existing.delete(eid);
            }
        }
    }, [units, mapPins, mapShapes, mapIcons, selectedUnitId, ready]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                ...style
            }}
        />
    );
}
