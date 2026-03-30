import { useState, useEffect, lazy, Suspense, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import UnitPanel from './components/UnitPanel';
import UnitForm from './components/UnitForm';
import Dashboard from './components/Dashboard';
import OperationsManager from './components/OperationsManager';
import { db } from './db';
import { themes, getStoredTheme, applyTheme } from './theme';

const MapPage = lazy(() => import('./components/MapPage'));

type Mode = 'dashboard' | 'operations' | 'map' | 'view' | 'create' | 'edit';

export default function App() {
  const [selected, setSelected] = useState<any>(null);
  const [mode, setMode] = useState<Mode>('dashboard');
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme);

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

  const handleBackup = async () => {
    try {
      const units = await db.units.toArray();
      const deployments = await db.deployments.toArray();
      const operations = await db.operations.toArray();
      const missions = await db.missions.toArray();
      const taskForces = await db.taskForces.toArray();
      const mapIcons = await db.mapIcons.toArray();
      const mapPins = await db.mapPins.toArray();
      const mapShapes = await db.mapShapes.toArray();

      const backup = {
        version: 5,
        timestamp: new Date().toISOString(),
        data: {
          units,
          deployments,
          operations,
          missions,
          taskForces,
          mapIcons,
          mapPins,
          mapShapes
        }
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `forcesight-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Backup failed:', error);
      alert('Failed to create backup');
    }
  };

  const restoreInputRef = useRef<HTMLInputElement>(null);

  const handleRestore = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      if (!backup.data || typeof backup.data !== 'object') {
        alert('Invalid backup file format');
        return;
      }

      const d = backup.data;
      const counts: string[] = [];

      // Clear existing data first
      await db.transaction('rw',
        [db.units, db.deployments, db.operations, db.missions, db.taskForces,
         db.mapIcons, db.mapPins, db.mapShapes],
        async () => {
          await db.units.clear();
          await db.deployments.clear();
          await db.operations.clear();
          await db.missions.clear();
          await db.taskForces.clear();
          await db.mapIcons.clear();
          await db.mapPins.clear();
          await db.mapShapes.clear();

          if (d.units?.length) {
            await db.units.bulkPut(d.units);
            counts.push(`${d.units.length} units`);
          }
          if (d.deployments?.length) {
            await db.deployments.bulkPut(d.deployments);
            counts.push(`${d.deployments.length} deployments`);
          }
          if (d.operations?.length) {
            await db.operations.bulkPut(d.operations);
            counts.push(`${d.operations.length} operations`);
          }
          if (d.missions?.length) {
            await db.missions.bulkPut(d.missions);
            counts.push(`${d.missions.length} missions`);
          }
          if (d.taskForces?.length) {
            await db.taskForces.bulkPut(d.taskForces);
            counts.push(`${d.taskForces.length} task forces`);
          }
          if (d.mapIcons?.length) {
            await db.mapIcons.bulkPut(d.mapIcons);
            counts.push(`${d.mapIcons.length} map icons`);
          }
          if (d.mapPins?.length) {
            await db.mapPins.bulkPut(d.mapPins);
            counts.push(`${d.mapPins.length} map pins`);
          }
          if (d.mapShapes?.length) {
            await db.mapShapes.bulkPut(d.mapShapes);
            counts.push(`${d.mapShapes.length} map shapes`);
          }
        }
      );

      alert(`Restore complete!\n\nImported: ${counts.join(', ') || 'empty backup'}`);
      setMode('dashboard');
      setSelected(null);
    } catch (error) {
      console.error('Restore failed:', error);
      alert('Failed to restore backup: ' + (error as Error).message);
    }

    e.target.value = '';
  }, []);

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
          <button onClick={() => setMode('create')}>+ New Unit</button>
          <div style={{ flex: 1 }} />
          <select
            className="input"
            value={currentTheme}
            onChange={e => setCurrentTheme(e.target.value)}
            style={{
              width: 'auto',
              fontSize: 12,
              padding: '6px 32px 6px 10px',
              background: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-accent)'
            }}
          >
            {themes.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button
            onClick={handleBackup}
            style={{
              background: 'var(--color-bg-elevated)',
              borderColor: 'var(--color-border-accent)'
            }}
          >
            ⬇ Backup
          </button>
          <button
            onClick={() => restoreInputRef.current?.click()}
            style={{
              background: 'var(--color-bg-elevated)',
              borderColor: 'var(--color-border-accent)'
            }}
          >
            ⬆ Restore
          </button>
          <input
            ref={restoreInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleRestore}
          />
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
                <UnitForm onDone={() => setMode('dashboard')} />
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
    </div>
  );
}
