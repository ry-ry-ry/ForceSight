import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';
import { daysBetween, today, calculateReadiness, escapeXml, militaryNameCompare } from '../../utils';
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
    format: 'svg' | 'html';
    bgColor: string;
    connectionColor: string;
    nodeStyle: 'card' | 'bare';
    scale: number;
    padding: number;
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
        includeEchelons: ['Command', 'Corps', 'Division', 'Brigade', 'Regiment', 'Battalion', 'Squadron', 'Company'],
        format: 'svg',
        bgColor: '#0a0e27',
        connectionColor: '#00d9ff',
        nodeStyle: 'card',
        scale: 1,
        padding: 80
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
            .sort((a, b) => militaryNameCompare(a.name, b.name));
    };

    const renderSubordinates = (parentUnit: Unit, depth: number = 0): React.ReactElement[] => {
        const subordinates = getSubordinates(parentUnit.id);
        const elements: React.ReactElement[] = [];

        subordinates.forEach(sub => {
            const subChildren = getSubordinates(sub.id);
            const hasChildren = subChildren.length > 0;

            if (hasChildren) {
                // Render as a parent group header
                elements.push(
                    <div
                        key={`header-${sub.id}`}
                        style={{
                            marginTop: depth > 0 ? 'var(--spacing-sm)' : 0,
                            paddingLeft: depth
                        }}
                    >
                        <div
                            onClick={() => onSelectUnit(sub)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-md)',
                                paddingTop: 'var(--spacing-sm)',
                                paddingRight: 'var(--spacing-sm)',
                                paddingBottom: 'var(--spacing-sm)',
                                paddingLeft: 'var(--spacing-sm)',
                                background: 'var(--color-bg-elevated)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-border-accent)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                marginBottom: 4
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-accent-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border-accent)';
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
                                <div style={{ fontWeight: 600, fontSize: 13 }}>
                                    {sub.name}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                                    {sub.echelon || sub.type} · {subChildren.length} subordinate{subChildren.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>
                        {renderSubordinates(sub, depth + 20)}
                    </div>
                );
            } else {
                // Render as a leaf unit
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
                            transition: 'all 0.2s ease',
                            marginBottom: 2
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
            }
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
            .sort((a, b) => militaryNameCompare(a.name, b.name))
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
        const isBare = settings.nodeStyle === 'bare';
        const connColor = settings.connectionColor;
        const bg = settings.bgColor;

        // Build tree
        const tree = buildHierarchyTree(unit, allUnits, settings);
        if (!tree) return '';

        // --- Text wrapping helper ---
        // Splits a name into lines that each fit within maxWidth chars at given fontSize (px).
        // Approximation: average char width ≈ fontSize * 0.55
        const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
            const approxCharWidth = fontSize * 0.55;
            const charsPerLine = Math.max(1, Math.floor(maxWidth / approxCharWidth));
            const words = text.split(' ');
            const lines: string[] = [];
            let current = '';
            words.forEach(word => {
                const candidate = current ? `${current} ${word}` : word;
                if (candidate.length <= charsPerLine) {
                    current = candidate;
                } else {
                    if (current) lines.push(current);
                    // If single word is too long, hard-wrap it
                    if (word.length > charsPerLine) {
                        let remaining = word;
                        while (remaining.length > charsPerLine) {
                            lines.push(remaining.substring(0, charsPerLine));
                            remaining = remaining.substring(charsPerLine);
                        }
                        current = remaining;
                    } else {
                        current = word;
                    }
                }
            });
            if (current) lines.push(current);
            return lines;
        };

        // --- Node sizing ---
        // Card mode: fixed width, height expands for text.
        // Bare mode: large patch + name below, no box.
        const NODE_W = 150; // card width / bare layout slot width

        // Bare mode uses bigger patches to emphasise the unit insignia
        const BARE_BADGE_ROOT = 80;
        const BARE_BADGE_CHILD = 64;

        // Card mode badges stay compact inside the box
        const BADGE_SIZE_ROOT = 48;
        const BADGE_SIZE = 36;

        const FONT_ROOT = 13;
        const FONT_CHILD = 11;
        const BARE_FONT_ROOT = 14;
        const BARE_FONT_CHILD = 12;
        const LINE_H = 16; // line height for text lines
        const BADGE_PAD = 8;  // gap between top of box and badge
        const TEXT_PAD = 6;   // gap between badge bottom and first text line
        const BOX_VPAD = 10;  // padding below last text line

        // Pre-calculate each node's rendered height so layout spacing is accurate
        const getNodeHeight = (isRoot: boolean): number => {
            if (isBare) {
                const bs = isRoot ? BARE_BADGE_ROOT : BARE_BADGE_CHILD;
                const fs = isRoot ? BARE_FONT_ROOT : BARE_FONT_CHILD;
                // patch + name (estimate 2 lines)
                return bs + TEXT_PAD + LINE_H * 2 + fs;
            }
            const badgeSize = isRoot ? BADGE_SIZE_ROOT : BADGE_SIZE;
            // We don't know the name yet at this point so use a max estimate (2 lines)
            return BADGE_PAD + badgeSize + TEXT_PAD + LINE_H * 2 + BOX_VPAD;
        };

        // Level spacing accounts for node height
        const rootH = getNodeHeight(true);
        const childH = getNodeHeight(false);
        const levelSpacing = isHorizontal
            ? NODE_W + (isBare ? 60 : 80)
            : Math.max(rootH, childH) + (isBare ? 60 : 80);

        const totalSize = calculateSubtreeSize(tree, isHorizontal);

        const getDepth = (node: HierarchyNode): number => {
            if (node.children.length === 0) return 1;
            return 1 + Math.max(...node.children.map(getDepth));
        };
        const depth = getDepth(tree);

        const padding = settings.padding;
        const scale = settings.scale;
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

        const scaledW = Math.round(imageWidth * scale);
        const scaledH = Math.round(imageHeight * scale);

        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${scaledW}" height="${scaledH}" viewBox="0 0 ${imageWidth} ${imageHeight}">`;
        svg += `<rect width="100%" height="100%" fill="${bg}"/>`;

        // Draw connections first (behind nodes)
        // Helper: returns the edge attachment point for a node depending on direction.
        // "exit" = where the line leaves the parent; "enter" = where it arrives at a child.
        // Vertical layout: exit = bottom-centre of node content, enter = top-centre of node content.
        // Horizontal layout: exit = right-centre, enter = left-centre.
        const exitPoint = (node: HierarchyNode, isRootNode: boolean): { x: number; y: number } => {
            if (isBare) {
                const bs = isRootNode ? BARE_BADGE_ROOT : BARE_BADGE_CHILD;
                if (isHorizontal) {
                    // right edge of patch; node.y is vertical centre
                    return { x: node.x + bs / 2, y: node.y };
                } else {
                    // bottom edge of patch; node.y is top of patch
                    return { x: node.x, y: node.y + bs };
                }
            } else {
                // Card: node.y is top of card box; use estimated card height
                const boxH = isRootNode ? rootH : childH;
                if (isHorizontal) {
                    // right edge of card; node.y is vertical centre of card
                    return { x: node.x + NODE_W / 2, y: node.y };
                } else {
                    // bottom edge of card
                    return { x: node.x, y: node.y + boxH };
                }
            }
        };

        const enterPoint = (node: HierarchyNode): { x: number; y: number } => {
            // Children are never the root node
            if (isBare) {
                const bs = BARE_BADGE_CHILD;
                if (isHorizontal) {
                    // left edge of patch; node.y is vertical centre
                    return { x: node.x - bs / 2, y: node.y };
                } else {
                    // top edge of patch; node.y is top of patch
                    return { x: node.x, y: node.y };
                }
            } else {
                if (isHorizontal) {
                    // left edge of card; node.y is vertical centre
                    return { x: node.x - NODE_W / 2, y: node.y };
                } else {
                    // top edge of card; node.y is top of card box
                    return { x: node.x, y: node.y };
                }
            }
        };

        const drawConnections = (node: HierarchyNode, isRootNode: boolean): void => {
            if (node.children.length === 0) return;

            const from = exitPoint(node, isRootNode);

            if (isHorizontal) {
                // Stub right from parent exit, then vertical crossbar, then stubs left to each child
                const crossbarX = from.x + 24;
                svg += `<line x1="${from.x}" y1="${from.y}" x2="${crossbarX}" y2="${from.y}" stroke="${connColor}" stroke-width="2"/>`;

                const topY = enterPoint(node.children[0]).y;
                const bottomY = enterPoint(node.children[node.children.length - 1]).y;
                if (topY !== bottomY) {
                    svg += `<line x1="${crossbarX}" y1="${topY}" x2="${crossbarX}" y2="${bottomY}" stroke="${connColor}" stroke-width="2"/>`;
                }
                node.children.forEach(child => {
                    const to = enterPoint(child);
                    svg += `<line x1="${crossbarX}" y1="${to.y}" x2="${to.x}" y2="${to.y}" stroke="${connColor}" stroke-width="2"/>`;
                });
            } else {
                // Stub down from parent exit, then horizontal crossbar, then stubs down to each child
                const crossbarY = from.y + 24;
                svg += `<line x1="${from.x}" y1="${from.y}" x2="${from.x}" y2="${crossbarY}" stroke="${connColor}" stroke-width="2"/>`;

                const leftX = enterPoint(node.children[0]).x;
                const rightX = enterPoint(node.children[node.children.length - 1]).x;
                if (leftX !== rightX) {
                    svg += `<line x1="${leftX}" y1="${crossbarY}" x2="${rightX}" y2="${crossbarY}" stroke="${connColor}" stroke-width="2"/>`;
                }
                node.children.forEach(child => {
                    const to = enterPoint(child);
                    svg += `<line x1="${to.x}" y1="${crossbarY}" x2="${to.x}" y2="${to.y}" stroke="${connColor}" stroke-width="2"/>`;
                });
            }

            node.children.forEach(child => drawConnections(child, false));
        };

        drawConnections(tree, true);

        // Draw nodes
        const drawNode = (node: HierarchyNode, isRoot: boolean): void => {
            const fontSize = isBare
                ? (isRoot ? BARE_FONT_ROOT : BARE_FONT_CHILD)
                : (isRoot ? FONT_ROOT : FONT_CHILD);
            const badgeSize = isBare
                ? (isRoot ? BARE_BADGE_ROOT : BARE_BADGE_CHILD)
                : (isRoot ? BADGE_SIZE_ROOT : BADGE_SIZE);

            if (isBare) {
                // ── BARE mode: large patch, name below, no card ──
                // node.x = horizontal centre, node.y = top of patch (vertical layout)
                // node.x = centre, node.y = centre of patch (horizontal layout)
                let cx: number, topY: number;
                if (isHorizontal) {
                    cx = node.x;
                    topY = node.y - badgeSize / 2;
                } else {
                    cx = node.x;
                    topY = node.y;
                }

                if (node.unit.patch) {
                    svg += `<image href="${escapeXml(node.unit.patch)}" x="${cx - badgeSize / 2}" y="${topY}" width="${badgeSize}" height="${badgeSize}" preserveAspectRatio="xMidYMid meet"/>`;
                } else {
                    // Placeholder circle — scales with badge size
                    const r = badgeSize / 2 - 2;
                    svg += `<circle cx="${cx}" cy="${topY + badgeSize / 2}" r="${r}" fill="#1a1f3a" stroke="${connColor}" stroke-width="1.5"/>`;
                    // Cross-hair inside placeholder
                    svg += `<line x1="${cx - r * 0.4}" y1="${topY + badgeSize / 2}" x2="${cx + r * 0.4}" y2="${topY + badgeSize / 2}" stroke="${connColor}" stroke-width="1" opacity="0.5"/>`;
                    svg += `<line x1="${cx}" y1="${topY + badgeSize / 2 - r * 0.4}" x2="${cx}" y2="${topY + badgeSize / 2 + r * 0.4}" stroke="${connColor}" stroke-width="1" opacity="0.5"/>`;
                }

                // Name below patch
                const lines = wrapText(node.unit.name, NODE_W, fontSize);
                const nameStartY = topY + badgeSize + TEXT_PAD + fontSize;
                lines.forEach((line, i) => {
                    svg += `<text x="${cx}" y="${nameStartY + i * LINE_H}" text-anchor="middle" fill="#f8fafc" font-family="system-ui" font-size="${fontSize}" font-weight="600">${escapeXml(line)}</text>`;
                });

            } else {
                // ── CARD mode ──
                const nodeFill = '#111827';
                const nodeBorder = '#334155';
                let boxX: number, boxY: number, cx: number;
                if (isHorizontal) {
                    boxX = node.x - NODE_W / 2;
                    boxY = node.y - rootH / 2;
                    cx = node.x;
                } else {
                    boxX = node.x - NODE_W / 2;
                    boxY = node.y;
                    cx = node.x;
                }

                // Compute wrapped lines first to know box height
                const lines = wrapText(node.unit.name, NODE_W - 16, fontSize);
                const boxH = BADGE_PAD + badgeSize + TEXT_PAD + lines.length * LINE_H + BOX_VPAD;

                // Box
                svg += `<rect x="${boxX}" y="${boxY}" width="${NODE_W}" height="${boxH}" rx="8" fill="${nodeFill}" stroke="${isRoot ? connColor : nodeBorder}" stroke-width="${isRoot ? 2 : 1}"/>`;

                // Badge
                const badgeX = cx - badgeSize / 2;
                const badgeY = boxY + BADGE_PAD;
                if (node.unit.patch) {
                    svg += `<image href="${escapeXml(node.unit.patch)}" x="${badgeX}" y="${badgeY}" width="${badgeSize}" height="${badgeSize}" preserveAspectRatio="xMidYMid meet"/>`;
                } else {
                    svg += `<circle cx="${cx}" cy="${badgeY + badgeSize / 2}" r="${badgeSize / 2 - 2}" fill="#1a1f3a" stroke="${nodeBorder}" stroke-width="1"/>`;
                }

                // Wrapped name lines
                const nameStartY = badgeY + badgeSize + TEXT_PAD + fontSize;
                lines.forEach((line, i) => {
                    svg += `<text x="${cx}" y="${nameStartY + i * LINE_H}" text-anchor="middle" fill="#f8fafc" font-family="system-ui" font-size="${fontSize}" font-weight="600">${escapeXml(line)}</text>`;
                });
            }

            node.children.forEach(child => drawNode(child, false));
        };

        drawNode(tree, true);

        svg += '</svg>';
        return svg;
    };

    const generateHierarchyHTML = (settings: HierarchySettings): string => {
        const svgContent = generateHierarchySVG(settings);
        if (!svgContent) return '';

        const unitName = escapeXml(unit.name);
        const sanitizeColor = (c: string) => /^#[0-9a-fA-F]{3,8}$/.test(c) ? c : '#000000';
        const bg = sanitizeColor(settings.bgColor);
        const conn = sanitizeColor(settings.connectionColor);

        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${unitName} – Unit Hierarchy</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: ${bg};
    --accent: ${conn};
    --text: #f8fafc;
    --muted: #64748b;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Rajdhani', system-ui, sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 36px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    background: rgba(0,0,0,0.25);
    backdrop-filter: blur(8px);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .header-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text);
  }

  .header-subtitle {
    font-size: 12px;
    color: var(--muted);
    font-family: 'JetBrains Mono', monospace;
    margin-top: 2px;
  }

  .accent-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
    flex-shrink: 0;
  }

  .badge {
    font-size: 11px;
    font-family: 'JetBrains Mono', monospace;
    color: var(--accent);
    border: 1px solid var(--accent);
    border-radius: 4px;
    padding: 3px 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  main {
    flex: 1;
    overflow: auto;
    padding: 48px 36px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .chart-wrapper {
    display: inline-block;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06);
  }

  footer {
    text-align: center;
    padding: 16px;
    font-size: 11px;
    color: var(--muted);
    font-family: 'JetBrains Mono', monospace;
    border-top: 1px solid rgba(255,255,255,0.05);
  }

  @media print {
    header, footer { display: none; }
    main { padding: 0; }
  }
</style>
</head>
<body>
<header>
  <div class="header-left">
    <div class="accent-dot"></div>
    <div>
      <div class="header-title">${unitName}</div>
      <div class="header-subtitle">Unit Hierarchy · ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
    </div>
  </div>
  <div class="badge">ForceSight</div>
</header>
<main>
  <div class="chart-wrapper">
    ${svgContent}
  </div>
</main>
<footer>Generated by ForceSight &nbsp;·&nbsp; ${new Date().toISOString()}</footer>
</body>
</html>`;
    };

    const downloadHierarchyImage = () => {
        const baseName = unit.name.replace(/\s+/g, '-').toLowerCase();

        if (hierarchySettings.format === 'html') {
            const html = generateHierarchyHTML(hierarchySettings);
            if (!html) return;
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${baseName}-hierarchy.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            const svg = generateHierarchySVG(hierarchySettings);
            if (!svg) return;
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${baseName}-hierarchy.svg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
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
                                    fontFamily: 'var(--font-mono)',
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

                            {/* Node Style */}
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                    Node Style
                                </label>
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                    <button
                                        onClick={() => setHierarchySettings(s => ({ ...s, nodeStyle: 'card' }))}
                                        style={{
                                            flex: 1,
                                            background: hierarchySettings.nodeStyle === 'card' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                                            color: hierarchySettings.nodeStyle === 'card' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
                                        }}
                                    >
                                        Cards
                                    </button>
                                    <button
                                        onClick={() => setHierarchySettings(s => ({ ...s, nodeStyle: 'bare' }))}
                                        style={{
                                            flex: 1,
                                            background: hierarchySettings.nodeStyle === 'bare' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                                            color: hierarchySettings.nodeStyle === 'bare' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
                                        }}
                                    >
                                        No Cards
                                    </button>
                                </div>
                                <div style={{ marginTop: 6, fontSize: 11, color: 'var(--color-text-muted)' }}>
                                    {hierarchySettings.nodeStyle === 'bare'
                                        ? 'Patches are displayed large with no surrounding box'
                                        : 'Each unit is shown in a dark card with patch and name'}
                                </div>
                            </div>

                            {/* Dimensions */}
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                    Dimensions
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>
                                            Scale — {hierarchySettings.scale}×
                                        </label>
                                        <input
                                            type="range"
                                            min={0.25}
                                            max={4}
                                            step={0.25}
                                            value={hierarchySettings.scale}
                                            onChange={e => setHierarchySettings(s => ({ ...s, scale: parseFloat(e.target.value) }))}
                                            style={{ width: '100%', accentColor: 'var(--color-accent-primary)' }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
                                            <span>0.25×</span><span>4×</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 4, fontSize: 11, color: 'var(--color-text-muted)' }}>
                                            Padding (px)
                                        </label>
                                        <input
                                            type="number"
                                            className="input"
                                            min={0}
                                            max={300}
                                            step={10}
                                            value={hierarchySettings.padding}
                                            onChange={e => setHierarchySettings(s => ({ ...s, padding: Math.max(0, parseInt(e.target.value) || 0) }))}
                                            style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: 12 }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Output Format */}
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                    Output Format
                                </label>
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                                    <button
                                        onClick={() => setHierarchySettings(s => ({ ...s, format: 'svg' }))}
                                        style={{
                                            flex: 1,
                                            background: hierarchySettings.format === 'svg' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                                            color: hierarchySettings.format === 'svg' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
                                        }}
                                    >
                                        SVG
                                    </button>
                                    <button
                                        onClick={() => setHierarchySettings(s => ({ ...s, format: 'html' }))}
                                        style={{
                                            flex: 1,
                                            background: hierarchySettings.format === 'html' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
                                            color: hierarchySettings.format === 'html' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
                                        }}
                                    >
                                        HTML Page
                                    </button>
                                </div>
                                {hierarchySettings.format === 'html' && (
                                    <div style={{ marginTop: 6, fontSize: 11, color: 'var(--color-text-muted)' }}>
                                        A self-contained HTML page with a clean header and scrollable chart
                                    </div>
                                )}
                            </div>

                            {/* Colours */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                        Background Colour
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input
                                            type="color"
                                            value={hierarchySettings.bgColor}
                                            onChange={e => setHierarchySettings(s => ({ ...s, bgColor: e.target.value }))}
                                            style={{
                                                width: 40,
                                                height: 36,
                                                border: '1px solid var(--color-border-primary)',
                                                borderRadius: 'var(--radius-sm)',
                                                cursor: 'pointer',
                                                background: 'none',
                                                padding: 2
                                            }}
                                        />
                                        <input
                                            type="text"
                                            className="input"
                                            value={hierarchySettings.bgColor}
                                            onChange={e => setHierarchySettings(s => ({ ...s, bgColor: e.target.value }))}
                                            style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12 }}
                                            maxLength={7}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                        Connection Colour
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input
                                            type="color"
                                            value={hierarchySettings.connectionColor}
                                            onChange={e => setHierarchySettings(s => ({ ...s, connectionColor: e.target.value }))}
                                            style={{
                                                width: 40,
                                                height: 36,
                                                border: '1px solid var(--color-border-primary)',
                                                borderRadius: 'var(--radius-sm)',
                                                cursor: 'pointer',
                                                background: 'none',
                                                padding: 2
                                            }}
                                        />
                                        <input
                                            type="text"
                                            className="input"
                                            value={hierarchySettings.connectionColor}
                                            onChange={e => setHierarchySettings(s => ({ ...s, connectionColor: e.target.value }))}
                                            style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12 }}
                                            maxLength={7}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Quick colour presets */}
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                                    Colour Presets
                                </label>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {[
                                        { label: 'Tactical Dark', bg: '#0a0e27', conn: '#00d9ff' },
                                        { label: 'Black', bg: '#000000', conn: '#00d9ff' },
                                        { label: 'Night Ops', bg: '#0d1117', conn: '#39d353' },
                                        { label: 'Desert', bg: '#1a1508', conn: '#d4a017' },
                                        { label: 'Print', bg: '#ffffff', conn: '#1a1a2e' },
                                        { label: 'Slate', bg: '#0f172a', conn: '#7c3aed' },
                                        { label: 'Crimson', bg: '#0d0a0a', conn: '#ef4444' },
                                        { label: 'Steel', bg: '#1c2128', conn: '#94a3b8' },
                                    ].map(preset => (
                                        <button
                                            key={preset.label}
                                            onClick={() => setHierarchySettings(s => ({ ...s, bgColor: preset.bg, connectionColor: preset.conn }))}
                                            title={`${preset.bg} / ${preset.conn}`}
                                            style={{
                                                fontSize: 11,
                                                padding: '4px 10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 6,
                                                background: preset.bg === hierarchySettings.bgColor && preset.conn === hierarchySettings.connectionColor
                                                    ? 'var(--color-bg-elevated)'
                                                    : 'var(--color-bg-tertiary)',
                                                border: preset.bg === hierarchySettings.bgColor && preset.conn === hierarchySettings.connectionColor
                                                    ? '1px solid var(--color-accent-primary)'
                                                    : '1px solid var(--color-border-primary)'
                                            }}
                                        >
                                            <span style={{
                                                display: 'inline-block',
                                                width: 10,
                                                height: 10,
                                                borderRadius: '50%',
                                                background: preset.conn,
                                                border: `2px solid ${preset.bg}`,
                                                outline: `1px solid ${preset.conn}`,
                                                flexShrink: 0
                                            }} />
                                            {preset.label}
                                        </button>
                                    ))}
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
                                Download {hierarchySettings.format === 'html' ? 'HTML' : 'SVG'}
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
                fontFamily: 'var(--font-mono)',
                color: valueColor || 'var(--color-text-primary)'
            }}>
                {value}
            </span>
        </div>
    );
}
