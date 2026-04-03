import Icon from '@/components/ui/icon';
import { Station } from '@/data/stations';

interface Props {
  stations: Station[];
  current: Station | null;
  favorites: string[];
  onSelect: (s: Station) => void;
  onToggleFav: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const GENRE_COLORS: Record<string, string> = {
  'Джаз': '#e8a030',
  'Классика': '#a080d0',
  'Ретро': '#d06040',
  'Новости': '#40a0d0',
  'Культура': '#80a040',
  'Романсы': '#d04080',
  'Разговорное': '#80d0a0',
  'Народная': '#c0a060',
  'Электронная': '#40d0c0',
  'Рок': '#d04040',
  'Поп': '#d080c0',
  'Разное': '#a0a0a0',
};

export default function StationList({ stations, current, favorites, onSelect, onToggleFav, onDelete }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {stations.map((s, i) => {
        const isCurrent = current?.id === s.id;
        const isFav = favorites.includes(s.id);
        const genreColor = GENRE_COLORS[s.genre] || '#a0a0a0';

        return (
          <div
            key={s.id}
            className="station-card rounded px-3 py-2.5 flex items-center gap-3 border animate-fade-in"
            style={{
              animationDelay: `${i * 40}ms`,
              borderColor: isCurrent ? 'var(--amber)' : 'rgba(255,255,255,0.06)',
              background: isCurrent ? 'rgba(232,160,48,0.1)' : 'rgba(255,255,255,0.02)',
              boxShadow: isCurrent ? '0 0 12px rgba(232,160,48,0.15)' : 'none',
            }}
            onClick={() => onSelect(s)}
          >
            {/* Number */}
            <span
              className="font-mono text-xs w-5 text-center shrink-0"
              style={{ color: isCurrent ? 'var(--amber)' : 'var(--amber-dim)' }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Genre dot */}
            <div
              className="rounded-full shrink-0"
              style={{ width: 6, height: 6, background: genreColor, boxShadow: isCurrent ? `0 0 6px ${genreColor}` : 'none' }}
            />

            {/* Name & freq */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <div
                  className="font-oswald text-sm tracking-wide truncate"
                  style={{ color: isCurrent ? 'var(--amber-glow)' : 'hsl(var(--foreground))' }}
                >
                  {s.name}
                </div>
                {s.custom && (
                  <span
                    className="font-mono text-[8px] px-1 rounded shrink-0"
                    style={{ background: 'rgba(232,160,48,0.15)', color: 'var(--amber-dim)', border: '1px solid rgba(232,160,48,0.2)' }}
                  >
                    своя
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[9px]" style={{ color: 'var(--amber-dim)' }}>
                  {s.frequency} МГц
                </span>
                <span
                  className="text-[8px] px-1 rounded"
                  style={{ color: genreColor, background: `${genreColor}18`, border: `1px solid ${genreColor}30` }}
                >
                  {s.genre}
                </span>
              </div>
            </div>

            {/* Playing indicator */}
            {isCurrent && (
              <div className="flex items-center gap-px shrink-0">
                {[1, 2, 3].map(b => (
                  <div
                    key={b}
                    style={{
                      width: 2,
                      background: 'var(--green-indicator)',
                      boxShadow: '0 0 4px var(--green-indicator)',
                      borderRadius: 1,
                      animation: `pulse-bar ${0.4 + b * 0.15}s ease-in-out infinite alternate`,
                      height: 8 + b * 4,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Fav button */}
            <button
              onClick={e => { e.stopPropagation(); onToggleFav(s.id); }}
              className="shrink-0 p-1 rounded transition-all"
              style={{ color: isFav ? '#e8a030' : 'rgba(255,255,255,0.2)' }}
              title={isFav ? 'Убрать из избранного' : 'В избранное'}
            >
              <Icon name={isFav ? 'Star' : 'StarOff'} size={13} />
            </button>

            {/* Delete button — only for custom stations */}
            {s.custom && onDelete && (
              <button
                onClick={e => { e.stopPropagation(); onDelete(s.id); }}
                className="shrink-0 p-1 rounded transition-all"
                style={{ color: 'rgba(255,80,80,0.35)' }}
                title="Удалить станцию"
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,80,80,0.8)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,80,80,0.35)')}
              >
                <Icon name="Trash2" size={13} />
              </button>
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes pulse-bar {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
