import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Player from '@/components/Player';
import StationList from '@/components/StationList';
import FavoritesTab from '@/components/FavoritesTab';
import SettingsTab from '@/components/SettingsTab';
import AddStationModal from '@/components/AddStationModal';
import { DEFAULT_STATIONS, Station } from '@/data/stations';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Tab = 'stations' | 'favorites' | 'settings';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'stations', label: 'Станции', icon: 'Radio' },
  { id: 'favorites', label: 'Избранное', icon: 'Star' },
  { id: 'settings', label: 'Настройки', icon: 'Settings2' },
];

export default function Index() {
  const [stations, setStations] = useLocalStorage<Station[]>('radiola_stations', DEFAULT_STATIONS);
  const [favorites, setFavorites] = useLocalStorage<string[]>('radiola_favorites', []);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [tab, setTab] = useState<Tab>('stations');
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleFav = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleAddStation = (s: Station) => {
    setStations(prev => [...prev, s]);
  };

  const handleDeleteStation = (id: string) => {
    setStations(prev => prev.filter(s => s.id !== id));
    if (currentStation?.id === id) setCurrentStation(null);
    setFavorites(prev => prev.filter(f => f !== id));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, #2a1505 0%, #0d0602 100%)' }}
    >
      {showAddModal && (
        <AddStationModal
          onAdd={handleAddStation}
          onClose={() => setShowAddModal(false)}
        />
      )}

      <div
        className="w-full max-w-md rounded-xl overflow-hidden animate-scale-in"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.5)' }}
      >
        {/* Wood frame top */}
        <div className="wood-texture px-5 pt-5 pb-3" style={{ borderBottom: '3px solid var(--wood-dark)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1
                className="font-oswald text-2xl uppercase animate-flicker"
                style={{
                  color: 'var(--amber-glow)',
                  textShadow: '0 0 20px var(--amber-glow), 0 0 40px rgba(232,160,48,0.3)',
                  letterSpacing: '0.25em',
                }}
              >
                ВЭФ · 202
              </h1>
              <div className="font-mono text-[9px] tracking-widest" style={{ color: 'rgba(255,200,80,0.4)', marginTop: -2 }}>
                ИНТЕРНЕТ РАДИОЛА · РИЖСКИЙ ЗАВОД
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2].map(i => (
                <div
                  key={i}
                  className="rounded-full animate-flicker"
                  style={{
                    width: 16, height: 16,
                    background: 'radial-gradient(circle, rgba(255,200,80,0.6) 0%, rgba(200,100,0,0.3) 60%, transparent 100%)',
                    border: '1px solid rgba(200,134,10,0.4)',
                    boxShadow: '0 0 10px rgba(232,160,48,0.4), inset 0 0 4px rgba(255,200,80,0.3)',
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <Player
            station={currentStation}
            onDeleteBroken={handleDeleteStation}
          />
        </div>

        <div className="wood-texture flex" style={{ height: 6 }}>
          <div className="grille flex-1" />
        </div>

        <div style={{ background: '#0f0905' }}>
          {/* Tab bar */}
          <div className="flex" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 transition-all"
                style={{
                  borderBottom: tab === t.id ? '2px solid var(--amber)' : '2px solid transparent',
                  color: tab === t.id ? 'var(--amber-glow)' : 'var(--amber-dim)',
                  background: tab === t.id ? 'rgba(232,160,48,0.05)' : 'transparent',
                }}
              >
                <Icon name={t.icon} fallback="Radio" size={13} />
                <span className="font-oswald text-xs tracking-widest uppercase">{t.label}</span>
                {t.id === 'favorites' && favorites.length > 0 && (
                  <span
                    className="font-mono text-[9px] rounded-full px-1"
                    style={{ background: 'var(--amber)', color: 'var(--wood-dark)', lineHeight: '14px', minWidth: 14, textAlign: 'center' }}
                  >
                    {favorites.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="overflow-y-auto" style={{ maxHeight: 380 }}>
            {tab === 'stations' && (
              <div className="p-4">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full mb-3 py-2 rounded flex items-center justify-center gap-2 transition-all"
                  style={{
                    border: '1px dashed rgba(232,160,48,0.3)',
                    color: 'var(--amber-dim)',
                    background: 'rgba(232,160,48,0.03)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(232,160,48,0.6)';
                    e.currentTarget.style.color = 'var(--amber)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(232,160,48,0.3)';
                    e.currentTarget.style.color = 'var(--amber-dim)';
                  }}
                >
                  <Icon name="Plus" size={13} />
                  <span className="font-oswald text-xs tracking-widest uppercase">Добавить станцию</span>
                </button>
                <StationList
                  stations={stations}
                  current={currentStation}
                  favorites={favorites}
                  onSelect={setCurrentStation}
                  onToggleFav={toggleFav}
                  onDelete={handleDeleteStation}
                />
              </div>
            )}
            {tab === 'favorites' && (
              <div className="p-4">
                <FavoritesTab
                  stations={stations}
                  favorites={favorites}
                  current={currentStation}
                  onSelect={setCurrentStation}
                  onToggleFav={toggleFav}
                />
              </div>
            )}
            {tab === 'settings' && (
              <div className="p-4">
                <SettingsTab />
              </div>
            )}
          </div>
        </div>

        <div className="wood-texture" style={{ height: 12 }} />
      </div>
    </div>
  );
}
