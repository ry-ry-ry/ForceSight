import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import UnitPanel from './components/UnitPanel';
import UnitForm from './components/UnitForm';
import Dashboard from './components/Dashboard';
import OperationsManager from './components/OperationsManager';
import { db } from './db';
import { themes, getStoredTheme, applyTheme } from './theme';

export default function App() {
  const [selected, setSelected] = useState<any>(null);
  const [mode, setMode] = useState<'dashboard' | 'operations' | 'view' | 'create' | 'edit'>('dashboard');
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const handleBackup = async () => {
    try {
      const units = await db.units.toArray();
      const deployments = await db.deployments.toArray();
      const operations = await db.operations.toArray();
      const missions = await db.missions.toArray();

      const backup = {
        version: 4,
        timestamp: new Date().toISOString(),
        data: {
          units,
          deployments,
          operations,
          missions
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

  return (
    <div style={{ display: 'flex', height: '100vh', position: 'relative' }}>

      <Sidebar
        select={(u: any) => {
          setSelected(u);
          setMode('view');
        }}
      />

      <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1 }}>

        <div style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--color-border-primary)',
          background: 'var(--color-bg-secondary)',
          display: 'flex',
          gap: 'var(--spacing-sm)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(10px)'
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
        </div>

        <div style={{ padding: 'var(--spacing-lg)' }}>
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

      </div>
    </div>
  );
}