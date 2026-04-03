import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Station } from '@/data/stations';

interface RadioBrowserStation {
  stationuuid: string;
  name: string;
  url_resolved: string;
  country: string;
  language: string;
  tags: string;
  bitrate: number;
  favicon: string;
  votes: number;
  codec: string;
}

interface Props {
  onAdd: (s: Station) => void;
  onClose: () => void;
  existingIds: string[];
}

const API = 'https://functions.poehali.dev/71ab09dd-f52a-46ef-9e52-5feb82812e97';

function guessGenre(tags: string, language: string): string {
  const t = (tags + ' ' + language).toLowerCase();
  if (t.includes('jazz')) return 'Джаз';
  if (t.includes('classic')) return 'Классика';
  if (t.includes('rock')) return 'Рок';
  if (t.includes('pop')) return 'Поп';
  if (t.includes('retro') || t.includes('oldies') || t.includes('60s') || t.includes('70s') || t.includes('80s')) return 'Ретро';
  if (t.includes('news') || t.includes('talk') || t.includes('новост') || t.includes('инфо')) return 'Новости';
  if (t.includes('electronic') || t.includes('dance') || t.includes('techno') || t.includes('house')) return 'Электронная';
  if (t.includes('folk') || t.includes('country') || t.includes('народ')) return 'Народная';
  if (t.includes('culture') || t.includes('культур')) return 'Культура';
  if (t.includes('русс') || t.includes('russian') || t.includes('rus')) return 'Разное';
  return 'Разное';
}

function toStation(r: RadioBrowserStation): Station {
  return {
    id: `rb_${r.stationuuid}`,
    name: r.name.trim(),
    country: r.country || '—',
    genre: guessGenre(r.tags, r.language),
    frequency: r.bitrate ? `${r.bitrate}k` : '—',
    url: r.url_resolved,
    description: r.tags ? r.tags.split(',').slice(0, 2).join(', ') : r.country,
    custom: true,
  };
}

const QUICK_TAGS = ['russian', 'jazz', 'classical', 'rock', 'pop', 'retro', 'electronic', 'news', 'soviet', 'folk'];

export default function SearchModal({ onAdd, onClose, existingIds }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RadioBrowserStation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [added, setAdded] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const doFetch = async (mode: 'search' | 'bytag', q: string) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${API}?mode=${mode}&q=${encodeURIComponent(q)}&limit=30`,
        { signal: abortRef.current.signal }
      );
      if (!res.ok) throw new Error('API error');
      const data: RadioBrowserStation[] = await res.json();
      setResults(data);
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') {
        setError('Не удалось получить результаты. Попробуйте ещё раз.');
      }
    } finally {
      setLoading(false);
    }
  };

  const search = (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    doFetch('search', q);
  };

  const searchByTag = (tag: string) => {
    setQuery(tag);
    doFetch('bytag', tag);
  };

  useEffect(() => {
    const timer = setTimeout(() => search(query), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const handleAdd = (r: RadioBrowserStation) => {
    onAdd(toStation(r));
    setAdded(prev => new Set([...prev, r.stationuuid]));
  };

  const isAdded = (r: RadioBrowserStation) =>
    added.has(r.stationuuid) || existingIds.includes(`rb_${r.stationuuid}`);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-xl overflow-hidden animate-scale-in flex flex-col"
        style={{
          background: '#0f0905',
          border: '1px solid rgba(200,134,10,0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(232,160,48,0.05)',
          maxHeight: '85vh',
        }}
      >
        {/* Header */}
        <div
          className="wood-texture px-5 py-4 flex items-center justify-between shrink-0"
          style={{ borderBottom: '2px solid var(--wood-dark)' }}
        >
          <div className="flex items-center gap-2">
            <Icon name="Search" size={16} style={{ color: 'var(--amber)' }} />
            <span className="font-oswald text-sm tracking-widest uppercase" style={{ color: 'var(--amber-glow)' }}>
              Поиск станций
            </span>
            <span className="font-mono text-[9px] px-1.5 rounded" style={{ background: 'rgba(232,160,48,0.1)', color: 'var(--amber-dim)', border: '1px solid rgba(232,160,48,0.2)' }}>
              30 000+ станций
            </span>
          </div>
          <button onClick={onClose} style={{ color: 'var(--amber-dim)' }}>
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Search input */}
        <div className="px-4 pt-4 pb-2 shrink-0">
          <div className="relative">
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--amber-dim)' }}
            >
              {loading
                ? <div className="w-3.5 h-3.5 rounded-full border border-current border-t-transparent animate-spin" />
                : <Icon name="Search" size={14} />
              }
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Название, страна, жанр..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#0a0805',
                border: '1px solid rgba(200,134,10,0.3)',
                borderRadius: 4,
                padding: '9px 12px 9px 36px',
                color: 'hsl(var(--foreground))',
                fontFamily: 'Rubik, sans-serif',
                fontSize: 13,
                outline: 'none',
              }}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setResults([]); }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--amber-dim)' }}
              >
                <Icon name="X" size={12} />
              </button>
            )}
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {QUICK_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => searchByTag(tag)}
                className="px-2 py-0.5 rounded transition-all"
                style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: 9,
                  border: `1px solid ${query === tag ? 'var(--amber)' : 'rgba(200,134,10,0.2)'}`,
                  background: query === tag ? 'rgba(232,160,48,0.12)' : 'rgba(232,160,48,0.04)',
                  color: query === tag ? 'var(--amber)' : 'var(--amber-dim)',
                  letterSpacing: '0.05em',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 px-4 pb-4">
          {error && (
            <div
              className="text-xs px-3 py-2 rounded flex items-center gap-2 mb-3"
              style={{ background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.3)', color: '#ff8080', fontFamily: 'Rubik, sans-serif' }}
            >
              <Icon name="AlertCircle" size={12} />
              {error}
            </div>
          )}

          {!loading && !error && results.length === 0 && query && (
            <div className="flex flex-col items-center py-10 gap-2">
              <Icon name="Radio" size={32} style={{ color: 'var(--amber-dim)', opacity: 0.3 }} />
              <span className="font-oswald text-sm" style={{ color: 'var(--amber-dim)' }}>Ничего не найдено</span>
            </div>
          )}

          {!query && results.length === 0 && (
            <div className="flex flex-col items-center py-8 gap-2 text-center">
              <Icon name="Globe" size={32} style={{ color: 'var(--amber-dim)', opacity: 0.3 }} />
              <div>
                <div className="font-oswald text-sm" style={{ color: 'var(--amber-dim)' }}>Введите запрос</div>
                <div className="font-rubik text-xs mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  или выберите тег выше
                </div>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="font-mono text-[9px] mb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Найдено: {results.length} станций
              </div>
              {results.map(r => {
                const alreadyAdded = isAdded(r);
                return (
                  <div
                    key={r.stationuuid}
                    className="rounded px-3 py-2.5 flex items-center gap-3 border transition-all"
                    style={{
                      borderColor: alreadyAdded ? 'rgba(74,255,106,0.2)' : 'rgba(255,255,255,0.06)',
                      background: alreadyAdded ? 'rgba(74,255,106,0.04)' : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    {/* Favicon / иконка */}
                    <div
                      className="shrink-0 rounded flex items-center justify-center overflow-hidden"
                      style={{ width: 28, height: 28, background: '#1a1205', border: '1px solid rgba(200,134,10,0.15)' }}
                    >
                      {r.favicon ? (
                        <img
                          src={r.favicon}
                          alt=""
                          style={{ width: 20, height: 20, objectFit: 'contain' }}
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <Icon name="Radio" size={12} style={{ color: 'var(--amber-dim)' }} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-oswald text-sm tracking-wide truncate" style={{ color: 'hsl(var(--foreground))' }}>
                        {r.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {r.country && (
                          <span className="font-mono text-[9px]" style={{ color: 'var(--amber-dim)' }}>
                            {r.country}
                          </span>
                        )}
                        {r.bitrate > 0 && (
                          <span className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                            {r.bitrate}kbps
                          </span>
                        )}
                        {r.codec && (
                          <span className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                            {r.codec}
                          </span>
                        )}
                        {r.tags && (
                          <span
                            className="text-[8px] px-1 rounded truncate"
                            style={{
                              color: 'var(--amber-dim)',
                              background: 'rgba(232,160,48,0.08)',
                              border: '1px solid rgba(232,160,48,0.15)',
                              maxWidth: 100,
                            }}
                          >
                            {r.tags.split(',')[0].trim()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add button */}
                    <button
                      onClick={() => !alreadyAdded && handleAdd(r)}
                      disabled={alreadyAdded}
                      className="shrink-0 rounded px-2.5 py-1.5 transition-all flex items-center gap-1"
                      style={{
                        background: alreadyAdded ? 'rgba(74,255,106,0.08)' : 'rgba(232,160,48,0.1)',
                        border: `1px solid ${alreadyAdded ? 'rgba(74,255,106,0.3)' : 'rgba(232,160,48,0.3)'}`,
                        color: alreadyAdded ? 'var(--green-indicator)' : 'var(--amber)',
                        fontSize: 9,
                        fontFamily: 'Oswald, sans-serif',
                        letterSpacing: '0.08em',
                        cursor: alreadyAdded ? 'default' : 'pointer',
                      }}
                    >
                      <Icon name={alreadyAdded ? 'Check' : 'Plus'} size={10} />
                      <span>{alreadyAdded ? 'добавлено' : 'добавить'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}