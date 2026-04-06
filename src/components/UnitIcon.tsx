import type { Unit, NatoSymbol } from '../database/types';
import { getEffectivePatch } from '../utils';
import {
    getNatoSymbolDataUrl,
    getNatoSymbolByCode,
    getSizeSymbolFromEchelon,
    type Affiliation
} from '../nato-symbol-library';

export type UnitIconSize = 'large' | 'medium' | 'small' | 'tiny';

interface UnitIconProps {
    unit: Unit;
    allUnits?: Unit[];
    customSymbols?: NatoSymbol[];
    size?: UnitIconSize;
    showNatoSymbol?: boolean;
}

const SIZE_CONFIG: Record<UnitIconSize, { patchSize: number; natoSize: number; gap: number; fontSize: number }> = {
    large: { patchSize: 100, natoSize: 100, gap: 8, fontSize: 24 },
    medium: { patchSize: 48, natoSize: 48, gap: 4, fontSize: 14 },
    small: { patchSize: 32, natoSize: 32, gap: 2, fontSize: 10 },
    tiny: { patchSize: 24, natoSize: 24, gap: 1, fontSize: 8 },
};

export function UnitIcon({
    unit,
    allUnits,
    customSymbols,
    size = 'medium',
    showNatoSymbol = true
}: UnitIconProps) {
    const config = SIZE_CONFIG[size];

    // Get effective patch (inherited from parent if not set)
    const patch = getEffectivePatch(unit, allUnits);

    // Determine NATO symbol to display
    const natoSymbolCode = unit.natoSymbol;
    const affiliation: Affiliation = unit.affiliation || 'friendly';

    // Determine size symbol from echelon or override
    const echelon = unit.sizeSymbolOverride || unit.echelon;
    const sizeSymbol = echelon ? getSizeSymbolFromEchelon(echelon) : undefined;

    // Get symbol metadata
    const symbolMeta = natoSymbolCode ? getNatoSymbolByCode(natoSymbolCode) : undefined;

    // Build NATO symbol URL
    const getNatoUrl = (): string | undefined => {
        if (!natoSymbolCode) return undefined;

        // Check for custom symbol first
        if (customSymbols) {
            const custom = customSymbols.find(s => s.code === natoSymbolCode || s.id === natoSymbolCode);
            if (custom?.image) return custom.image;
        }

        // Generate crisp SVG using milsymbol
        return getNatoSymbolDataUrl(natoSymbolCode, affiliation, config.natoSize);
    };

    const natoUrl = getNatoUrl();

    // Default patch SVG (placeholder)
    const defaultPatchSvg = `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${config.patchSize}" height="${config.patchSize}" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="var(--color-bg-secondary)" stroke="var(--color-border)" stroke-width="2"/>
            <text x="50" y="50" text-anchor="middle" dominant-baseline="middle" fill="var(--color-text-muted)" font-size="12">?</text>
        </svg>
    `)}`;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: config.gap,
        }}>
            {/* NATO symbol (if enabled and present) - now on the LEFT */}
            {showNatoSymbol && natoUrl && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'var(--color-bg-tertiary)',
                    borderRadius: 2,
                    padding: 2,
                    border: '1px solid var(--color-border-accent)',
                }}>
                    {/* Size marker */}
                    {sizeSymbol && (
                        <span style={{
                            fontSize: config.fontSize,
                            fontWeight: 'bold',
                            color: 'var(--color-text-primary)',
                            lineHeight: 1,
                        }}>
                            {sizeSymbol.symbol}
                        </span>
                    )}

                    {/* Function symbol */}
                    <img
                        src={natoUrl}
                        alt={symbolMeta?.name || 'NATO symbol'}
                        title={symbolMeta?.name || natoSymbolCode}
                        style={{
                            width: config.natoSize,
                            height: config.natoSize,
                            objectFit: 'contain',
                        }}
                    />
                </div>
            )}

            {/* Patch image - now on the RIGHT */}
            <img
                src={patch || defaultPatchSvg}
                alt={unit.name}
                style={{
                    width: config.patchSize,
                    height: config.patchSize,
                    objectFit: 'contain',
                    borderRadius: 4,
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-secondary)',
                }}
            />
        </div>
    );
}