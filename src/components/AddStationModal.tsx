import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Station } from '@/data/stations';

interface Props {
  onAdd: (s: Station) => void;
  onClose: () => void;
}

const GENRES = ['Ретро', 'Джаз', 'Классика', 'Рок', 'Поп', 'Новости', 'Культура', 'Народная', 'Электронная', 'Разговорное', 'Разное'];

export default function AddStationModal({ onAdd, onClose }: Props) {
  const [form, setForm] = useState({
    name: '',
    url: '',
    genre: 'Разное',
    frequency: '',
    description: '',
  });
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleAdd = () => {
    if (!form.name.trim()) { setError('Введите название станции'); return; }
    if (!form.url.trim()) { setError('Введите URL потока'); return; }
    if (!form.url.startsWith('http')) { setError('URL должен начинаться с http:// или https://'); return; }
    setError('');
    onAdd({
      id: `custom_${Date.now()}`,
      name: form.name.trim(),
      url: form.url.trim(),
      genre: form.genre,
      frequency: form.frequency || '—',
      description: form.description || form.genre,
      country: 'СССР',
      custom: true,
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    background: '#0a0805',
    border: '1px solid rgba(200,134,10,0.25)',
    color: 'hsl(var(--foreground))',
    borderRadius: 4,
    padding: '8px 12px',
    width: '100%',
    fontSize: 13,
    fontFamily: 'Rubik, sans-serif',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-xl overflow-hidden animate-scale-in"
        style={{
          background: '#0f0905',
          border: '1px solid rgba(200,134,10,0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(232,160,48,0.05)',
        }}
      >
        {/* Header */}
        <div
          className="wood-texture px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '2px solid var(--wood-dark)' }}
        >
          <div className="flex items-center gap-2">
            <Icon name="Plus" size={16} style={{ color: 'var(--amber)' }} />
            <span
              className="font-oswald text-sm tracking-widest uppercase"
              style={{ color: 'var(--amber-glow)' }}
            >
              Добавить станцию
            </span>
          </div>
          <button onClick={onClose} style={{ color: 'var(--amber-dim)' }} className="hover:text-amber-400 transition-colors">
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 flex flex-col gap-3">
          {/* Name */}
          <div>
            <label className="font-oswald text-[10px] tracking-widest uppercase block mb-1.5" style={{ color: 'var(--amber-dim)' }}>
              Название
            </label>
            <input
              type="text"
              placeholder="Например: Радио Восток"
              value={form.name}
              onChange={set('name')}
              style={inputStyle}
            />
          </div>

          {/* URL */}
          <div>
            <label className="font-oswald text-[10px] tracking-widest uppercase block mb-1.5" style={{ color: 'var(--amber-dim)' }}>
              URL потока
            </label>
            <input
              type="url"
              placeholder="https://stream.example.com/radio.mp3"
              value={form.url}
              onChange={set('url')}
              style={inputStyle}
            />
            <div className="mt-1 font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Поддерживаются: .mp3, .aac, .ogg потоки
            </div>
          </div>

          {/* Genre + Frequency row */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="font-oswald text-[10px] tracking-widest uppercase block mb-1.5" style={{ color: 'var(--amber-dim)' }}>
                Жанр
              </label>
              <select value={form.genre} onChange={set('genre')} style={{ ...inputStyle, cursor: 'pointer' }}>
                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div style={{ width: 90 }}>
              <label className="font-oswald text-[10px] tracking-widest uppercase block mb-1.5" style={{ color: 'var(--amber-dim)' }}>
                МГц
              </label>
              <input
                type="text"
                placeholder="99.5"
                value={form.frequency}
                onChange={set('frequency')}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="font-rubik text-xs px-3 py-2 rounded flex items-center gap-2"
              style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)', color: '#ff8080' }}
            >
              <Icon name="AlertCircle" size={12} />
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded btn-retro font-oswald text-xs tracking-widest uppercase transition-all"
              style={{ color: 'var(--amber-dim)' }}
            >
              Отмена
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-2.5 rounded font-oswald text-xs tracking-widest uppercase transition-all"
              style={{
                background: 'linear-gradient(180deg, rgba(232,160,48,0.2) 0%, rgba(139,94,26,0.3) 100%)',
                border: '1px solid var(--amber-dim)',
                color: 'var(--amber-glow)',
                boxShadow: '0 0 12px rgba(232,160,48,0.15)',
              }}
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
