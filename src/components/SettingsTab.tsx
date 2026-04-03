import { useState } from 'react';
import Icon from '@/components/ui/icon';

export default function SettingsTab() {
  const [eq, setEq] = useState({ bass: 50, mid: 50, treble: 50 });
  const [stereo, setStereo] = useState(true);
  const [autoplay, setAutoplay] = useState(false);
  const [theme, setTheme] = useState<'amber' | 'green' | 'blue'>('amber');

  const themeColors = {
    amber: { color: '#e8a030', label: 'Янтарный' },
    green: { color: '#4aff6a', label: 'Зелёный' },
    blue: { color: '#40a0f0', label: 'Синий' },
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">

      {/* Equalizer */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Sliders" size={14} style={{ color: 'var(--amber)' }} />
          <span className="font-oswald text-xs tracking-widest uppercase" style={{ color: 'var(--amber-dim)' }}>
            Эквалайзер
          </span>
        </div>
        <div className="rounded p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {([
            { key: 'bass', label: 'НЧ' },
            { key: 'mid', label: 'СЧ' },
            { key: 'treble', label: 'ВЧ' },
          ] as const).map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3 mb-3 last:mb-0">
              <span className="font-oswald text-xs w-6 shrink-0" style={{ color: 'var(--amber-dim)' }}>{label}</span>
              <div className="flex-1 relative" style={{ height: 4 }}>
                <div className="absolute inset-0 rounded" style={{ background: '#1a1a1a', border: '1px solid #333' }} />
                <div
                  className="absolute top-0 left-0 h-full rounded"
                  style={{
                    width: `${eq[key]}%`,
                    background: 'linear-gradient(90deg, var(--amber-dim), var(--amber))',
                    boxShadow: '0 0 4px rgba(232,160,48,0.3)',
                  }}
                />
                <input
                  type="range" min={0} max={100} value={eq[key]}
                  onChange={e => setEq(prev => ({ ...prev, [key]: +e.target.value }))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  style={{ height: '100%' }}
                />
              </div>
              <span className="font-mono text-[10px] w-8 text-right" style={{ color: 'var(--amber-dim)' }}>
                {eq[key] - 50 > 0 ? '+' : ''}{eq[key] - 50}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Options */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Settings2" size={14} style={{ color: 'var(--amber)' }} />
          <span className="font-oswald text-xs tracking-widest uppercase" style={{ color: 'var(--amber-dim)' }}>
            Параметры
          </span>
        </div>
        <div className="rounded p-4 flex flex-col gap-3" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { label: 'Стерео режим', val: stereo, set: setStereo, icon: 'AudioLines' },
            { label: 'Автовоспроизведение', val: autoplay, set: setAutoplay, icon: 'Play' },
          ].map(({ label, val, set, icon }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name={icon} fallback="Settings" size={13} style={{ color: 'var(--amber-dim)' }} />
                <span className="font-rubik text-sm" style={{ color: 'hsl(var(--foreground))' }}>{label}</span>
              </div>
              <button
                onClick={() => set(!val)}
                className="rounded-full transition-all"
                style={{
                  width: 36,
                  height: 20,
                  background: val ? 'var(--green-dim)' : '#1a1a1a',
                  border: `1px solid ${val ? 'var(--green-indicator)' : '#444'}`,
                  position: 'relative',
                  boxShadow: val ? '0 0 8px rgba(74,255,106,0.3)' : 'none',
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: val ? 'var(--green-indicator)' : '#555',
                    position: 'absolute',
                    top: 2,
                    left: val ? 18 : 2,
                    transition: 'all 0.2s ease',
                    boxShadow: val ? '0 0 6px var(--green-indicator)' : 'none',
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Theme */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Palette" size={14} style={{ color: 'var(--amber)' }} />
          <span className="font-oswald text-xs tracking-widest uppercase" style={{ color: 'var(--amber-dim)' }}>
            Тема подсветки
          </span>
        </div>
        <div className="flex gap-2">
          {(Object.entries(themeColors) as [typeof theme, { color: string; label: string }][]).map(([key, { color, label }]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className="flex-1 rounded py-2 text-center transition-all btn-retro"
              style={{
                border: `1px solid ${theme === key ? color : '#333'}`,
                boxShadow: theme === key ? `0 0 10px ${color}40` : undefined,
              }}
            >
              <div className="rounded-full mx-auto mb-1" style={{ width: 12, height: 12, background: color, boxShadow: theme === key ? `0 0 6px ${color}` : 'none' }} />
              <span className="font-mono text-[9px]" style={{ color: theme === key ? color : 'var(--amber-dim)' }}>{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Info */}
      <div className="text-center pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="font-oswald text-xs tracking-widest" style={{ color: 'var(--amber-dim)' }}>
          РАДИОЛА ВЭФ-202
        </div>
        <div className="font-mono text-[9px] mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
          Рижский завод ВЭФ · СССР · 1975
        </div>
      </div>
    </div>
  );
}