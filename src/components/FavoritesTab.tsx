import Icon from '@/components/ui/icon';
import { Station } from '@/data/stations';
import StationList from './StationList';

interface Props {
  stations: Station[];
  favorites: string[];
  current: Station | null;
  onSelect: (s: Station) => void;
  onToggleFav: (id: string) => void;
}

export default function FavoritesTab({ stations, favorites, current, onSelect, onToggleFav }: Props) {
  const favStations = stations.filter(s => favorites.includes(s.id));

  if (favStations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 animate-fade-in">
        <Icon name="Star" size={40} style={{ color: 'var(--amber-dim)', opacity: 0.4 }} />
        <div className="text-center">
          <div className="font-oswald text-base tracking-wide" style={{ color: 'var(--amber-dim)' }}>
            Избранных станций нет
          </div>
          <div className="font-rubik text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Нажмите ★ рядом со станцией, чтобы добавить
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="Star" size={14} style={{ color: 'var(--amber)' }} />
        <span className="font-oswald text-xs tracking-widest uppercase" style={{ color: 'var(--amber-dim)' }}>
          Избранное · {favStations.length}
        </span>
      </div>
      <StationList
        stations={favStations}
        current={current}
        favorites={favorites}
        onSelect={onSelect}
        onToggleFav={onToggleFav}
      />
    </div>
  );
}
