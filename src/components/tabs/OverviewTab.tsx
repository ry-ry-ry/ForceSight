import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { daysBetween, today, calculateReadiness } from '../../utils';
import type { Unit } from '../../db';
import React, { useState } from 'react';

interface HierarchyNode {
    unit: Unit;
    children: HierarchyNode[];
    x: number;
    y: number;
    width: number;
}

interface HierarchySettings {
    orientation: 'vertical' | 'horizontal';
    includeEchelons: string[];
}

interface HierarchyNode {
    unit: Unit;
    children: HierarchyNode[];
    x: number;
    y: number;
    width: number;
}

export default function OverviewTab({ unit, onSelectUnit }: any) {
    const deployments = useLiveQuery(
        () => db.deployments.where('unitId').equals(unit.id).sortBy('startDate'),
        [unit.id]
    );

    const allUnits = useLiveQuery(() => db.units.toArray(), []);
    const taskForces = useLiveQuery(() => db.taskForces.toArray(), []);

    const unitTaskForce = taskForces?.find(tf => tf.id === unit.taskForceId);

    const [showHierarchyDialog, setShowHierarchyDialog] = useState(false);
    const [hierarchySettings, setHierarchySettings] = useState<HierarchySettings>({
        orientation: 'vertical',
        includeEchelons: ['Command', 'Corps', 'Division', 'Brigade', 'Regiment', 'Battalion', 'Squadron', 'Company']
    });

    const active = deployments?.find(d => !d.endDate);
    const completed = deployments?.filter(d => d.endDate).sort((a, b) =>
        new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime()
    );
    const lastCompleted = completed?.[0];

    // Current deployment length
    const currentDeploymentLength = active
        ? daysBetween(active.startDate, today())
        : null;

    // Last deployment length
    const lastDeploymentLength = lastCompleted
        ? daysBetween(lastCompleted.startDate, lastCompleted.endDate!)
        : null;

    // Rest period (time since last deployment ended)
    const restPeriod = lastCompleted && !active
        ? daysBetween(lastCompleted.endDate!, today())
        : null;

    // Calculate readiness
    const readiness = calculateReadiness(
        active ? null : lastDeploymentLength,
        active ? null : restPeriod
    );

    const buildHierarchy = () => {
        if (!allUnits) return [];

        const hierarchy: Unit[] = [];
        let current: Unit | undefined = unit;

        while (current) {
            hierarchy.unshift(current);
            current = allUnits.find(u => u.id === current?.parentId);
        }

        return hierarchy;
    };

    const getSubordinates = (unitId: string): Unit[] => {
        if (!allUnits) return [];
        return allUnits
            .filter(u => u.parentId === unitId)
            .sort((a, b) => a.name.localeCompare(b.name));
    };

    const renderSubordinates = (parentUnit: Unit, depth: number = 0): React.ReactElement[] => {
        const subordinates = getSubordinates(parentUnit.id);
        const elements: React.ReactElement[] = [];

        subordinates.forEach(sub => {
            elements.push(
                <div
                    key={sub.id}
                    onClick={() => onSelectUnit(sub)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-md)',
                        paddingTop: 'var(--spacing-sm)',
                        paddingRight: 'var(--spacing-sm)',
                        paddingBottom: 'var(--spacing-sm)',
                        paddingLeft: depth,
                        background: 'var(--color-bg-tertiary)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border-primary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--color-bg-elevated)';
                        e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                        e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                    }}
                >
                    <span style={{ color: 'var(--color-accent-primary)', fontSize: 12 }}>└─</span>
                    {sub.patch && (
                        <img
                            src={sub.patch}
                            alt={`${sub.name} patch`}
                            style={{
                                width: 32,
                                height: 32,
                                objectFit: 'contain',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-border-accent)'
                            }}
                        />
                    )}
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: sub.id === unit.id ? 'bold' : 'normal', fontSize: 13 }}>
                            {sub.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                            {sub.echelon || sub.type}
                        </div>
                    </div>
                </div>
            );
            elements.push(...renderSubordinates(sub, depth + 20));
        });

        return elements;
    };

    // SVG Hierarchy Generation Functions
    const buildHierarchyTree = (rootUnit: Unit, allUnits: Unit[], settings: HierarchySettings): HierarchyNode | null => {
        // Filter out units whose echelon is not in the include list
        if (rootUnit.echelon && !settings.includeEchelons.includes(rootUnit.echelon)) {
            return null;
        }

        const children = allUnits
            .filter(u => u.parentId === rootUnit.id)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(child => buildHierarchyTree(child, allUnits, settings))
            .filter((node): node is HierarchyNode => node !== null);

        return {
            unit: rootUnit,
            children,
            x: 0,
            y: 0,
            width: 0
        };
    };

    const calculateSubtreeSize = (node: HierarchyNode, isHorizontal: boolean): number => {
        if (node.children.length === 0) {
            node.width = isHorizontal ? 160 : 180;
            return node.width;
        }

        let totalSize = 0;
        node.children.forEach(child => {
            totalSize += calculateSubtreeSize(child, isHorizontal);
        });

        // Add spacing between children
        totalSize += (node.children.length - 1) * (isHorizontal ? 60 : 40);

        node.width = Math.max(isHorizontal ? 160 : 180, totalSize);
        return node.width;
    };

    const positionNodesVertical = (node: HierarchyNode, x: number, y: number, levelHeight: number): void => {
        node.x = x + node.width / 2;
        node.y = y;

        if (node.children.length === 0) return;

        let childX = x;
        node.children.forEach(child => {
            positionNodesVertical(child, childX, y + levelHeight, levelHeight);
            childX += child.width + 40;
        });
    };

    const positionNodesHorizontal = (node: HierarchyNode, x: number, y: number, levelWidth: number): void => {
        node.x = x;
        node.y = y + node.width / 2;

        if (node.children.length === 0) return;

        let childY = y;
        node.children.forEach(child => {
            positionNodesHorizontal(child, x + levelWidth, childY, levelWidth);
            childY += child.width + 60;
        });
    };

    const generateHierarchySVG = (settings: HierarchySettings): string => {
        if (!allUnits) return '';

        const isHorizontal = settings.orientation === 'horizontal';

        // Build tree
        const tree = buildHierarchyTree(unit, allUnits, settings);
        if (!tree) return '';

        const totalSize = calculateSubtreeSize(tree, isHorizontal);

        // Calculate depth
        const getDepth = (node: HierarchyNode): number => {
            if (node.children.length === 0) return 1;
            return 1 + Math.max(...node.children.map(getDepth));
        };
        const depth = getDepth(tree);

        const levelSpacing = isHorizontal ? 200 : 160;
        const padding = 80;

        let imageWidth: number, imageHeight: number;

        if (isHorizontal) {
            imageWidth = depth * levelSpacing + padding * 2;
            imageHeight = totalSize + padding * 2;
            positionNodesHorizontal(tree, padding, padding, levelSpacing);
        } else {
            imageWidth = totalSize + padding * 2;
            imageHeight = depth * levelSpacing + padding * 2;
            positionNodesVertical(tree, padding, padding, levelSpacing);
        }

        // Generate SVG
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${imageWidth}" height="${imageHeight}" viewBox="0 0 ${imageWidth} ${imageHeight}">`;

        // Background
        svg += `<rect width="100%" height="100%" fill="#0a0e27"/>`;

        // Helper to truncate text
        const truncateText = (text: string, maxChars: number): string => {
            if (text.length <= maxChars) return text;
            return text.substring(0, maxChars - 2) + '…';
        };

        // Draw connections recursively
        const drawConnections = (node: HierarchyNode): void => {
            if (node.children.length === 0) return;

            if (isHorizontal) {
                const crossbarX = node.x + 100;
                const childX = node.x + levelSpacing;

                // Horizontal line from parent to crossbar
                svg += `<line x1="${node.x + 90}" y1="${node.y}" x2="${crossbarX}" y2="${node.y}" stroke="#00d9ff" stroke-width="2"/>`;

                if (node.children.length > 0) {
                    // Vertical crossbar
                    const topY = node.children[0].y;
                    const bottomY = node.children[node.children.length - 1].y;
                    svg += `<line x1="${crossbarX}" y1="${topY}" x2="${crossbarX}" y2="${bottomY}" stroke="#00d9ff" stroke-width="2"/>`;

                    // Horizontal stubs to children
                    node.children.forEach(child => {
                        svg += `<line x1="${crossbarX}" y1="${child.y}" x2="${childX}" y2="${child.y}" stroke="#00d9ff" stroke-width="2"/>`;
                    });
                }
            } else {
                const crossbarY = node.y + 80;
                const childY = node.y + levelSpacing;

                // Vertical line from parent to crossbar
                svg += `<line x1="${node.x}" y1="${node.y + 70}" x2="${node.x}" y2="${crossbarY}" stroke="#00d9ff" stroke-width="2"/>`;

                if (node.children.length > 0) {
                    // Horizontal crossbar
                    const leftX = node.children[0].x;
                    const rightX = node.children[node.children.length - 1].x;
                    svg += `<line x1="${leftX}" y1="${crossbarY}" x2="${rightX}" y2="${crossbarY}" stroke="#00d9ff" stroke-width="2"/>`;

                    // Vertical stubs to children
                    node.children.forEach(child => {
                        svg += `<line x1="${child.x}" y1="${crossbarY}" x2="${child.x}" y2="${childY}" stroke="#00d9ff" stroke-width="2"/>`;
                    });
                }
            }

            node.children.forEach(child => drawConnections(child));
        };

        drawConnections(tree);

        // Draw nodes recursively
        const drawNode = (node: HierarchyNode, isRoot: boolean = false): void => {
            const boxWidth = isRoot ? 160 : 140;
            const boxHeight = isRoot ? 90 : 70;

            let boxX: number, boxY: number;
            if (isHorizontal) {
                boxX = node.x - boxWidth / 2;
                boxY = node.y - boxHeight / 2;
            } else {
                boxX = node.x - boxWidth / 2;
                boxY = node.y;
            }

            // Box background
            svg += `<rect x="${boxX}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" rx="8" fill="#111827" stroke="${isRoot ? '#00d9ff' : '#334155'}" stroke-width="${isRoot ? 2 : 1}"/>`;

            // Badge
            const badgeSize = isRoot ? 48 : 36;
            const badgeX = node.x - badgeSize / 2;
            const badgeY = isHorizontal ? boxY + 8 : boxY + 8;

            if (node.unit.patch) {
                svg += `<image href="${node.unit.patch}" x="${badgeX}" y="${badgeY}" width="${badgeSize}" height="${badgeSize}" preserveAspectRatio="xMidYMid meet"/>`;
            } else {
                // Placeholder circle
                svg += `<circle cx="${node.x}" cy="${badgeY + badgeSize / 2}" r="${badgeSize / 2 - 2}" fill="#1a1f3a" stroke="#334155" stroke-width="1"/>`;
            }

            // Unit name (truncated)
            const textY = isHorizontal ? boxY + boxHeight / 2 + 4 : boxY + (isRoot ? 68 : 52);
            const fontSize = isRoot ? 13 : 11;
            const maxChars = Math.floor(boxWidth / (fontSize * 0.55));
            const displayName = truncateText(node.unit.name, maxChars);
            svg += `<text x="${node.x}" y="${textY}" text-anchor="middle" fill="#f8fafc" font-family="system-ui" font-size="${fontSize}" font-weight="600">${displayName}</text>`;

            // Echelon only (no type)
            if (node.unit.echelon) {
                const echelonY = textY + 16;
                svg += `<text x="${node.x}" y="${echelonY}" text-anchor="middle" fill="#64748b" font-family="system-ui" font-size="10">${node.unit.echelon}</text>`;
            }

            // Draw children
            node.children.forEach(child => drawNode(child, false));
        };

        drawNode(tree, true);

        svg += '</svg>';
        return svg;
    };

    const downloadHierarchyImage = () => {
        const svg = generateHierarchySVG(hierarchySettings);
        if (!svg) return;

        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${unit.name.replace(/\s+/g, '-').toLowerCase()}-hierarchy.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const hierarchy = buildHierarchy();
    const subordinates = getSubordinates(unit.id);

    const handleTaskForceChange = async (taskForceId: string) => {
        await db.units.update(unit.id, { taskForceId: taskForceId || undefined });
    };

    return (
        <div style={{ display: 'grid', gap: 'var(--spacing-xl)' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)' }}>

                {/* Operational Status */}
                <div className="card">
                    <h3>Operational Status</h3>
                    <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                        <InfoRow label="Status" value={unit.status} />
                        <InfoRow label="Type" value={unit.type} />
                        {unit.echelon && <InfoRow label="Echelon" value={unit.echelon} />}
                        {unit.country && <InfoRow label="Country" value={unit.country} />}

                        <div style={{ marginTop: 'var(--spacing-sm)' }}>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                Task Force Assignment
                            </label>
                            <select
                                className="input"
                                value={unit.taskForceId || ''}
                                onChange={e => handleTaskForceChange(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                <option value="">No Task Force</option>
                                {taskForces?.map(tf => (
                                    <option key={tf.id} value={tf.id}>
                                        {tf.name}
                                    </option>
                                ))}
                            </select>
                            {unitTaskForce && (
                                <div style={{
                                    marginTop: 'var(--spacing-xs)',
                                    fontSize: 11,
                                    color: 'var(--color-accent-primary)'
                                }}>
                                    Currently assigned to: {unitTaskForce.name}
                                    {unitTaskForce.description && ` - ${unitTaskForce.description}`}
                                </div>
                            )}
                        </div>

                        <div style={{
                            marginTop: 'var(--spacing-sm)',
                            padding: 'var(--spacing-md)',
                            background: 'var(--color-bg-primary)',
                            borderRadius: 'var(--radius-sm)',
                            border: `2px solid ${readiness.color}`
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                                    Readiness
                                </span>
                                <span style={{
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: readiness.color,
                                    fontFamily: 'JetBrains Mono',
                                    textTransform: 'uppercase'
                                }}>
                                    {readiness.label}
                                </span>
                            </div>
                            {readiness.ratio > 0 && readiness.ratio < 10 && (
                                <div style={{
                                    marginTop: 'var(--spacing-sm)',
                                    fontSize: 11,
                                    color: 'var(--color-text-muted)'
                                }}>
                                    Rest/Deploy Ratio: {readiness.ratio.toFixed(2)}:1
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Deployment Metrics */}
                <div className="card">
                    <h3>Deployment Metrics</h3>
                    <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                        {active ? (
                            <>
                                <InfoRow
                                    label="Current Status"
                                    value="Deployed"
                                    valueColor="var(--color-status-deployed)"
                                />
                                <InfoRow
                                    label="Current Deployment"
                                    value={`${currentDeploymentLength} days`}
                                    valueColor="var(--color-accent-primary)"
                                />
                                <InfoRow
                                    label="Operation"
                                    value={active.operation || active.name}
                                />
                            </>
                        ) : (
                            <>
                                <InfoRow
                                    label="Current Status"
                                    value="Available"
                                    valueColor="var(--color-status-standby)"
                                />
                                {lastDeploymentLength && (
                                    <InfoRow
                                        label="Last Deployment"
                                        value={`${lastDeploymentLength} days`}
                                        valueColor="var(--color-text-secondary)"
                                    />
                                )}
                                {restPeriod !== null && (
                                    <InfoRow
                                        label="Rest Period"
                                        value={`${restPeriod} days`}
                                        valueColor="var(--color-accent-secondary)"
                                    />
                                )}
                                {!lastCompleted && (
                                    <div style={{
                                        padding: 'var(--spacing-md)',
                                        textAlign: 'center',
                                        color: 'var(--color-text-muted)',
                                        fontSize: 12
                                    }}>
                                        No deployment history
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

            </div>

            {/* Unit Hierarchy */}
            {hierarchy.length > 1 && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        <h3 style={{ margin: 0 }}>Chain of Command</h3>
                        <button onClick={() => setShowHierarchyDialog(true)} style={{ fontSize: 11, padding: '4px 8px' }}>
                            Generate Hierarchy Image
                        </button>
                    </div>
                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        {hierarchy.map((u, index) => (
                            <div
                                key={u.id}
                                onClick={() => u.id !== unit.id && onSelectUnit(u)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-md)',
                                    paddingLeft: index * 20,
                                    marginBottom: 'var(--spacing-sm)',
                                    padding: 'var(--spacing-sm)',
                                    background: u.id === unit.id ? 'var(--color-bg-elevated)' : 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: u.id === unit.id ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border-primary)',
                                    cursor: u.id !== unit.id ? 'pointer' : 'default',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (u.id !== unit.id) {
                                        e.currentTarget.style.background = 'var(--color-bg-elevated)';
                                        e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (u.id !== unit.id) {
                                        e.currentTarget.style.background = 'var(--color-bg-tertiary)';
                                        e.currentTarget.style.borderColor = 'var(--color-border-primary)';
                                    }
                                }}
                            >
                                {index > 0 && (
                                    <span style={{ color: 'var(--color-accent-primary)', fontSize: 12 }}>└─</span>
                                )}
                                {u.patch && (
                                    <img
                                        src={u.patch}
                                        alt={`${u.name} patch`}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            objectFit: 'contain',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid var(--color-border-accent)'
                                        }}
                                    />
                                )}
                                <div>
                                    <div style={{ fontWeight: u.id === unit.id ? 'bold' : 'normal', fontSize: 13 }}>
                                        {u.name}
                                    </div>
                                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                                        {u.echelon || u.type}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Subordinate Units */}
            {subordinates.length > 0 && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        <h3 style={{ margin: 0 }}>Subordinate Units</h3>
                        <button onClick={() => setShowHierarchyDialog(true)} style={{ fontSize: 11, padding: '4px 8px' }}>
                            Generate Hierarchy Image
                        </button>
                    </div>
                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-md)',
                                marginBottom: 'var(--spacing-md)',
                                padding: 'var(--spacing-sm)',
                                background: 'var(--color-bg-elevated)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-accent-primary)'
                            }}
                        >
                            {unit.patch && (
                                <img
                                    src={unit.patch}
                                    alt={`${unit.name} patch`}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        objectFit: 'contain',
                                        borderRadius: 'var(--radius-sm)',
                                        border: '1px solid var(--color-border-accent)'
                                    }}
                                />
                            )}
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: 13 }}>
                                    {unit.name}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                                    {unit.echelon || unit.type}
                                </div>
                            </div>
                        </div>
                        {renderSubordinates(unit, 20)}
                    </div>
                </div>
            )}

            {/* Hierarchy Image Dialog */}
            {showHierarchyDialog && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'var(--color-bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-xl)',
                        maxWidth: 500,
                        width: '90%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        border: '1px solid var(--color-border-accent)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                            <h2 style={{ margin: 0 }}>Generate Hierarchy Image</h2>
                            <button onClick={() => setShowHierarchyDialog(false)} style={{ fontSize: 18, padding: '4px 12px' }}>×</button>
                        </div>

                        <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                            {/* Orientation */}
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                    Orientation
                                </label>
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                    <button
                                        onClick={() => setHierarchySettings(s => ({ ...s, orientation: 'vertical' }))}
                                        style={{
                                            flex: 1,
                                            background: hierarchySettings.orientation === 'vertical' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                                            color: hierarchySettings.orientation === 'vertical' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
                                        }}
                                    >
                                        Vertical
                                    </button>
                                    <button
                                        onClick={() => setHierarchySettings(s => ({ ...s, orientation: 'horizontal' }))}
                                        style={{
                                            flex: 1,
                                            background: hierarchySettings.orientation === 'horizontal' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                                            color: hierarchySettings.orientation === 'horizontal' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
                                        }}
                                    >
                                        Horizontal
                                    </button>
                                </div>
                            </div>

                            {/* Echelons to Include */}
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                    Echelons to Include
                                </label>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: 'var(--spacing-xs)',
                                    padding: 'var(--spacing-sm)',
                                    background: 'var(--color-bg-tertiary)',
                                    borderRadius: 'var(--radius-sm)'
                                }}>
                                    {['Command', 'Corps', 'Division', 'Brigade', 'Regiment', 'Battalion', 'Squadron', 'Company'].map(echelon => (
                                        <label key={echelon} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-xs)',
                                            padding: 'var(--spacing-xs)',
                                            cursor: 'pointer',
                                            fontSize: 12
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={hierarchySettings.includeEchelons.includes(echelon)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setHierarchySettings(s => ({
                                                            ...s,
                                                            includeEchelons: [...s.includeEchelons, echelon]
                                                        }));
                                                    } else {
                                                        setHierarchySettings(s => ({
                                                            ...s,
                                                            includeEchelons: s.includeEchelons.filter(e => e !== echelon)
                                                        }));
                                                    }
                                                }}
                                            />
                                            {echelon}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-xl)', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowHierarchyDialog(false)}>
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    downloadHierarchyImage();
                                    setShowHierarchyDialog(false);
                                }}
                                style={{
                                    background: 'var(--color-accent-primary)',
                                    borderColor: 'var(--color-accent-primary)',
                                    color: 'var(--color-bg-primary)'
                                }}
                            >
                                Download SVG
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

function InfoRow({ label, value, valueColor }: any) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--spacing-sm)',
            background: 'var(--color-bg-tertiary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 13
        }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
            <span style={{
                fontWeight: 600,
                fontFamily: 'JetBrains Mono',
                color: valueColor || 'var(--color-text-primary)'
            }}>
                {value}
            </span>
        </div>
    );
}
