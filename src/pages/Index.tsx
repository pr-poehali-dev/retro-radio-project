import { useState } from 'react';
import Icon from '@/components/ui/icon';
import Player from '@/components/Player';
import StationList from '@/components/StationList';
import FavoritesTab from '@/components/FavoritesTab';
import SettingsTab from '@/components/SettingsTab';
import { STATIONS, Station } from '@/data/stations';

type Tab = 'stations' | 'favorites' | 'settings';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'stations', label: 'Станции', icon: 'Radio' },
  { id: 'favorites', label: 'Избранное', icon: 'Star' },
  { id: 'settings', label: 'Настройки', icon: 'Settings2' },
];

export default function Index() {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [tab, setTab] = useState<Tab>('stations');

  const toggleFav = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleSelect = (s: Station) => {
    setCurrentStation(s);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #2a1505 0%, #0d0602 100%)',
      }}
    >
      {/* Main body */}
      <div
        className="w-full max-w-md rounded-xl overflow-hidden animate-scale-in"
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        {/* Wood frame top */}
        <div
          className="wood-texture px-5 pt-5 pb-3"
          style={{
            borderBottom: '3px solid var(--wood-dark)',
          }}
        >
          {/* Brand plate */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1
                className="font-oswald text-2xl tracking-[0.2em] uppercase animate-flicker"
                style={{
                  color: 'var(--amber-glow)',
                  textShadow: '0 0 20px var(--amber-glow), 0 0 40px rgba(232,160,48,0.3)',
                  letterSpacing: '0.25em',
                }}
              >
                ВЭФ · 202
              </h1>
              <div
                className="font-mono text-[9px] tracking-widest"
                style={{ color: 'rgba(255,200,80,0.4)', marginTop: -2 }}
              >
                ИНТЕРНЕТ РАДИОЛА · РИЖСКИЙ ЗАВОД
              </div>
            </div>

            {/* Lamp decor */}
            <div className="flex items-center gap-2">
              {[1, 2].map(i => (
                <div
                  key={i}
                  className="rounded-full animate-flicker"
                  style={{
                    width: 16,
                    height: 16,
                    background: 'radial-gradient(circle, rgba(255,200,80,0.6) 0%, rgba(200,100,0,0.3) 60%, transparent 100%)',
                    border: '1px solid rgba(200,134,10,0.4)',
                    boxShadow: '0 0 10px rgba(232,160,48,0.4), inset 0 0 4px rgba(255,200,80,0.3)',
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Player */}
          <Player station={currentStation} />
        </div>

        {/* Speaker grille sides */}
        <div className="wood-texture flex" style={{ height: 6 }}>
          <div className="grille flex-1" />
        </div>

        {/* Bottom panel: tabs + content */}
        <div style={{ background: '#0f0905' }}>

          {/* Tab bar */}
          <div
            className="flex"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
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
                    style={{
                      background: 'var(--amber)',
                      color: 'var(--wood-dark)',
                      lineHeight: '14px',
                      minWidth: 14,
                      textAlign: 'center',
                    }}
                  >
                    {favorites.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4 overflow-y-auto" style={{ maxHeight: 380 }}>
            {tab === 'stations' && (
              <StationList
                stations={STATIONS}
                current={currentStation}
                favorites={favorites}
                onSelect={handleSelect}
                onToggleFav={toggleFav}
              />
            )}
            {tab === 'favorites' && (
              <FavoritesTab
                stations={STATIONS}
                favorites={favorites}
                current={currentStation}
                onSelect={handleSelect}
                onToggleFav={toggleFav}
              />
            )}
            {tab === 'settings' && <SettingsTab />}
          </div>
        </div>

        {/* Bottom wood strip */}
        <div className="wood-texture" style={{ height: 12 }} />
      </div>
    </div>
  );
}
