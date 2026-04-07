import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import UnitPanel from './components/UnitPanel';
import UnitForm from './components/UnitForm';
import Dashboard from './components/Dashboard';
import OperationsManager from './components/OperationsManager';
import AdminPanel from './components/AdminPanel';
import SettingsDialog from './components/SettingsDialog';
import { getStoredTheme, applyTheme } from './theme';
import { db } from './database/adapter';

const MapPage = lazy(() => import('./components/MapPage'));

type Mode = 'dashboard' | 'operations' | 'map' | 'admin' | 'view' | 'create' | 'edit';

// Parse URL hash to get mode and unit id
function parseHash(): { mode: Mode; unitId: string | null } {
  const hash = window.location.hash.slice(1); // Remove #
  if (!hash) return { mode: 'dashboard', unitId: null };

  const [modePart, idPart] = hash.split('/');
  const validModes: Mode[] = ['dashboard', 'operations', 'map', 'admin', 'view', 'create', 'edit'];

  if (validModes.includes(modePart as Mode)) {
    return { mode: modePart as Mode, unitId: idPart || null };
  }
  return { mode: 'dashboard', unitId: null };
}

// Update URL hash
function updateHash(mode: Mode, unitId?: string | null) {
  const newHash = unitId ? `${mode}/${unitId}` : mode;
  // Only update if different to avoid extra history entries
  if (window.location.hash.slice(1) !== newHash) {
    window.history.pushState(null, '', `#${newHash}`);
  }
}

export default function App() {
  const [selected, setSelected] = useState<any>(null);
  const [mode, setModeState] = useState<Mode>('dashboard');
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [createDefaults, setCreateDefaults] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  // Wrapper for setMode that also updates URL
  const setMode = useCallback((newMode: Mode) => {
    setModeState(newMode);
    updateHash(newMode, selected?.id);
  }, [selected?.id]);

  // Wrapper for selecting a unit and switching to view mode
  const selectUnit = useCallback((u: any) => {
    setSelected(u);
    setModeState('view');
    updateHash('view', u?.id);
  }, []);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  // Restore state from URL hash on initial load
  useEffect(() => {
    const restoreFromHash = async () => {
      const { mode: hashMode, unitId } = parseHash();

      if (unitId) {
        try {
          const unit = await db.units.get(unitId);
          if (unit) {
            setSelected(unit);
            setModeState(hashMode);
          } else {
            // Unit not found, go to dashboard
            setModeState('dashboard');
          }
        } catch {
          setModeState('dashboard');
        }
      } else {
        setModeState(hashMode);
      }
      setInitialized(true);
    };

    restoreFromHash();
  }, []);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = async () => {
      const { mode: hashMode, unitId } = parseHash();

      if (unitId) {
        try {
          const unit = await db.units.get(unitId);
          if (unit) {
            setSelected(unit);
            setModeState(hashMode);
          } else {
            setSelected(null);
            setModeState('dashboard');
          }
        } catch {
          setSelected(null);
          setModeState('dashboard');
        }
      } else {
        setSelected(null);
        setModeState(hashMode);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dynamic page title
  useEffect(() => {
    const base = 'ForceSight';
    let title = base;
    switch (mode) {
      case 'dashboard':
        title = `${base} — Dashboard`;
        break;
      case 'operations':
        title = `${base} — Operations`;
        break;
      case 'map':
        title = `${base} — Map`;
        break;
      case 'admin':
        title = `${base} — Admin`;
        break;
      case 'create':
        title = `${base} — New Unit`;
        break;
      case 'edit':
        title = selected?.name
          ? `${base} — Editing ${selected.name}`
          : `${base} — Edit Unit`;
        break;
      case 'view':
        title = selected?.name
          ? `${selected.name} — ${base}`
          : base;
        break;
    }
    document.title = title;
  }, [mode, selected]);

  const isMapMode = mode === 'map';

  // Don't render until we've restored state from URL
  if (!initialized) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-primary)' }}>
        <div style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>

      <Sidebar
        select={selectUnit}
      />

      <div style={{ flex: 1, overflowY: isMapMode ? 'hidden' : 'auto', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>

        <div style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--color-border-primary)',
          background: 'var(--color-bg-secondary)',
          display: 'flex',
          gap: 'var(--spacing-sm)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          flexShrink: 0
        }}>
          <button
            onClick={() => setMode('dashboard')}
            style={{
              background: mode === 'dashboard' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
              borderColor: mode === 'dashboard' ? 'var(--color-accent-primary)' : 'var(--color-border-accent)',
              color: mode === 'dashboard' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
            }}
          >
            ◈ Dashboard
          </button>
          <button
            onClick={() => setMode('operations')}
            style={{
              background: mode === 'operations' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
              borderColor: mode === 'operations' ? 'var(--color-accent-primary)' : 'var(--color-border-accent)',
              color: mode === 'operations' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
            }}
          >
            ◉ Operations
          </button>
          <button
            onClick={() => setMode('map')}
            style={{
              background: mode === 'map' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
              borderColor: mode === 'map' ? 'var(--color-accent-primary)' : 'var(--color-border-accent)',
              color: mode === 'map' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
            }}
          >
            🌐 Map
          </button>
          <button onClick={() => { setCreateDefaults(null); setMode('create'); }}>+ New Unit</button>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => setMode('admin')}
            style={{
              background: mode === 'admin' ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
              borderColor: mode === 'admin' ? 'var(--color-accent-primary)' : 'var(--color-border-accent)',
              color: mode === 'admin' ? 'var(--color-bg-primary)' : 'var(--color-text-primary)',
              fontSize: 13,
            }}
          >
            ⚙ Admin
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            style={{
              background: settingsOpen ? 'var(--color-accent-primary)' : 'var(--color-bg-elevated)',
              borderColor: settingsOpen ? 'var(--color-accent-primary)' : 'var(--color-border-accent)',
              color: settingsOpen ? 'var(--color-bg-primary)' : 'var(--color-text-primary)',
              fontSize: 13,
            }}
          >
            ⚙ Settings
          </button>
        </div>

        {isMapMode ? (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Suspense fallback={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
                Loading map...
              </div>
            }>
              <MapPage onSelectUnit={selectUnit} />
            </Suspense>
          </div>
        ) : (
          <div style={{ padding: 'var(--spacing-lg)', flex: 1 }}>
            {mode === 'dashboard' && (
              <Dashboard onSelectUnit={selectUnit} />
            )}

            {mode === 'operations' && (
              <OperationsManager onSelectUnit={selectUnit} />
            )}

            {mode === 'admin' && (
              <div className="animate-fade-in">
                <AdminPanel onClose={() => setMode('dashboard')} />
              </div>
            )}

            {mode === 'create' && (
              <div className="animate-fade-in">
                <UnitForm defaults={createDefaults} onDone={async (newUnitId?: string) => {
                  setCreateDefaults(null);
                  if (newUnitId) {
                    try {
                      const newUnit = await db.units.get(newUnitId);
                      if (newUnit) {
                        selectUnit(newUnit);
                        return;
                      }
                    } catch {}
                  }
                  setMode('dashboard');
                }} />
              </div>
            )}

            {mode === 'edit' && selected && (
              <div className="animate-fade-in">
                <UnitForm unit={selected} onDone={async () => {
                  // Refresh the selected unit from the database to get updated fields
                  try {
                    const updatedUnit = await db.units.get(selected.id);
                    if (updatedUnit) {
                      setSelected(updatedUnit);
                    }
                  } catch {}
                  setMode('view');
                }} />
              </div>
            )}

            {mode === 'view' && selected && (
              <div className="animate-fade-in">
                <UnitPanel
                  unit={selected}
                  onEdit={() => setMode('edit')}
                  onSelectUnit={selectUnit}
                  onAddSubordinate={(parentUnit: any) => {
                    setCreateDefaults({
                      parentId: parentUnit.id,
                      country: parentUnit.country || '',
                    });
                    setMode('create');
                  }}
                />
              </div>
            )}

            {!selected && mode === 'view' && (
              <div style={{
                textAlign: 'center',
                padding: 'var(--spacing-2xl)',
                color: 'var(--color-text-muted)'
              }}>
                Select a unit from the sidebar
              </div>
            )}
          </div>
        )}

      </div>

      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        onRestoreComplete={() => {
          setMode('dashboard');
          setSelected(null);
        }}
      />
    </div>
  );
}
