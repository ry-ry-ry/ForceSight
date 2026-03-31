export const today = () => new Date().toISOString().slice(0, 10);

export const daysBetween = (a: string, b: string) =>
    Math.floor((+new Date(b) - +new Date(a)) / 86400000);

/**
 * Escape a string for safe interpolation into XML/SVG/HTML markup.
 * Prevents injection via unit names, descriptions, or other user input.
 */
export const escapeXml = (str: string): string =>
    str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

/**
 * Natural sort comparator for military unit names with ordinal numbers.
 * Splits names on numeric boundaries and compares numbers numerically,
 * so "1st SFG" < "2nd SFG" < "10th SFG" < "19th SFG"
 * instead of alphabetical "10th" < "19th" < "1st" < "2nd".
 */
export const militaryNameCompare = (a: string, b: string): number => {
    const tokenize = (s: string) =>
        s.split(/(\d+)/).map(t => /^\d+$/.test(t) ? parseInt(t, 10) : t.toLowerCase());
    const at = tokenize(a);
    const bt = tokenize(b);
    for (let i = 0; i < Math.max(at.length, bt.length); i++) {
        const av = at[i] ?? '';
        const bv = bt[i] ?? '';
        if (typeof av === 'number' && typeof bv === 'number') {
            if (av !== bv) return av - bv;
        } else {
            const cmp = String(av).localeCompare(String(bv));
            if (cmp !== 0) return cmp;
        }
    }
    return 0;
};

export interface ReadinessStatus {
    level: 'high' | 'medium' | 'low';
    color: string;
    label: string;
    ratio: number;
}

export function calculateReadiness(
    lastDeploymentLength: number | null,
    restPeriod: number | null
): ReadinessStatus {
    // If no deployment history, assume high readiness
    if (!lastDeploymentLength || lastDeploymentLength === 0) {
        return {
            level: 'high',
            color: 'var(--color-status-standby)',
            label: 'High',
            ratio: 1
        };
    }

    // If no rest period (currently deployed), readiness is low
    if (!restPeriod || restPeriod === 0) {
        return {
            level: 'low',
            color: 'var(--color-status-deployed)',
            label: 'Low',
            ratio: 0
        };
    }

    // Calculate rest-to-deployment ratio
    const ratio = restPeriod / lastDeploymentLength;

    // High readiness: rest period >= deployment length (1:1 or better)
    if (ratio >= 1.0) {
        return {
            level: 'high',
            color: 'var(--color-status-standby)',
            label: 'High',
            ratio
        };
    }

    // Medium readiness: rest period is 50-100% of deployment length
    if (ratio >= 0.5) {
        return {
            level: 'medium',
            color: 'var(--color-status-training)',
            label: 'Medium',
            ratio
        };
    }

    // Low readiness: rest period < 50% of deployment length
    return {
        level: 'low',
        color: 'var(--color-status-deployed)',
        label: 'Low',
        ratio
    };
}

export interface RotationStatus {
    status: 'overdue' | 'urgent' | 'soon' | 'ok';
    daysDeployed: number;
    daysUntilRotation: number;
    rotationThreshold: number;
    color: string;
    priority: number;
}

export function calculateRotationStatus(
    unitType: string,
    deploymentStartDate: string
): RotationStatus {
    // Rotation thresholds in days
    const thresholds: Record<string, number> = {
        'SOF': 180,      // 6 months
        'Air': 180,      // 6 months
        'Ground': 270,   // 9 months
        'Support': 270   // 9 months (default)
    };

    const rotationThreshold = thresholds[unitType] || 270;
    const daysDeployed = daysBetween(deploymentStartDate, today());
    const daysUntilRotation = rotationThreshold - daysDeployed;

    // Overdue: past rotation threshold
    if (daysUntilRotation <= 0) {
        return {
            status: 'overdue',
            daysDeployed,
            daysUntilRotation,
            rotationThreshold,
            color: 'var(--color-status-deployed)',
            priority: 1
        };
    }

    // Urgent: within 30 days of rotation
    if (daysUntilRotation <= 30) {
        return {
            status: 'urgent',
            daysDeployed,
            daysUntilRotation,
            rotationThreshold,
            color: 'var(--color-status-training)',
            priority: 2
        };
    }

    // Soon: within 60 days of rotation
    if (daysUntilRotation <= 60) {
        return {
            status: 'soon',
            daysDeployed,
            daysUntilRotation,
            rotationThreshold,
            color: 'var(--color-accent-secondary)',
            priority: 3
        };
    }

    // OK: more than 60 days until rotation
    return {
        status: 'ok',
        daysDeployed,
        daysUntilRotation,
        rotationThreshold,
        color: 'var(--color-status-standby)',
        priority: 4
    };
}

// ── Health & Effectiveness ───────────────────────────────────────────

export interface EffectivenessInfo {
    label: string;
    color: string;
}

/**
 * Map a 0–100 effectiveness percentage to a category label and colour.
 *   80–100  →  Effective
 *   70–79   →  Slightly Degraded
 *   60–69   →  Degraded
 *   40–59   →  Heavily Degraded
 *    0–39   →  Combat Ineffective
 */
export function getEffectivenessInfo(pct: number): EffectivenessInfo {
    if (pct >= 80) return { label: 'Effective',           color: 'var(--color-status-standby)' };
    if (pct >= 70) return { label: 'Slightly Degraded',   color: 'var(--color-accent-secondary)' };
    if (pct >= 60) return { label: 'Degraded',            color: 'var(--color-status-training)' };
    if (pct >= 40) return { label: 'Heavily Degraded',    color: 'var(--color-status-deployed)' };
    return              { label: 'Combat Ineffective',    color: '#dc2626' };
}

export function getHealthColor(health: string): string {
    switch (health) {
        case 'Healthy':   return 'var(--color-status-standby)';
        case 'Damaged':   return 'var(--color-status-training)';
        case 'Destroyed': return '#dc2626';
        default:          return 'var(--color-text-muted)';
    }
}