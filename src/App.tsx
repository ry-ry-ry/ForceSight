import { useState, useEffect, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import UnitPanel from './components/UnitPanel';
import UnitForm from './components/UnitForm';
import Dashboard from './components/Dashboard';
import OperationsManager from './components/OperationsManager';
import SettingsDialog from './components/SettingsDialog';
import { getStoredTheme, applyTheme } from './theme';

const MapPage = lazy(() => import('./components/MapPage'));

type Mode = 'dashboard' | 'operations' | 'map' | 'view' | 'create' | 'edit';

export default function App() {
  const [selected, setSelected] = useState<any>(null);
  const [mode, setMode] = useState<Mode>('dashboard');
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [createDefaults, setCreateDefaults] = useState<any>(null);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

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

  return (
    <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>

      <Sidebar
        select={(u: any) => {
          setSelected(u);
          setMode('view');
        }}
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
              <MapPage onSelectUnit={(u: any) => {
                setSelected(u);
                setMode('view');
              }} />
            </Suspense>
          </div>
        ) : (
          <div style={{ padding: 'var(--spacing-lg)', flex: 1 }}>
            {mode === 'dashboard' && (
              <Dashboard onSelectUnit={(u: any) => {
                setSelected(u);
                setMode('view');
              }} />
            )}

            {mode === 'operations' && (
              <OperationsManager onSelectUnit={(u: any) => {
                setSelected(u);
                setMode('view');
              }} />
            )}

            {mode === 'create' && (
              <div className="animate-fade-in">
                <UnitForm defaults={createDefaults} onDone={() => { setCreateDefaults(null); setMode('dashboard'); }} />
              </div>
            )}

            {mode === 'edit' && selected && (
              <div className="animate-fade-in">
                <UnitForm unit={selected} onDone={() => setMode('view')} />
              </div>
            )}

            {mode === 'view' && selected && (
              <div className="animate-fade-in">
                <UnitPanel
                  unit={selected}
                  onEdit={() => setMode('edit')}
                  onSelectUnit={(u: any) => {
                    setSelected(u);
                    setMode('view');
                  }}
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
