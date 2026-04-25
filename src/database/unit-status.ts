import { db } from './adapter';

/**
 * Sync `unit.status` to whether the unit has any active (no-endDate) deployment.
 *  - Has active deployment → 'Deployed'
 *  - No active deployment  → 'Reset'
 * Bases (status='Active') and Destroyed units are skipped.
 */
export async function reconcileUnitStatus(unitId: string): Promise<void> {
    const unit = await db.units.get(unitId);
    if (!unit) return;
    if (unit.status === 'Active') return;
    if (unit.health === 'Destroyed') return;

    const deployments = await db.deployments.where('unitId').equals(unitId).toArray();
    const hasActive = deployments.some(d => !d.endDate);
    const desired = hasActive ? 'Deployed' : 'Reset';

    if (unit.status !== desired) {
        await db.units.update(unitId, { status: desired });
    }
}

export async function reconcileUnitStatuses(unitIds: Iterable<string>): Promise<void> {
    const seen = new Set<string>();
    for (const id of unitIds) {
        if (seen.has(id)) continue;
        seen.add(id);
        await reconcileUnitStatus(id);
    }
}
