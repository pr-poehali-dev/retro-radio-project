import { useRef, useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import FrequencyScale from './FrequencyScale';
import VuMeter from './VuMeter';
import { Station } from '@/data/stations';

interface Props {
  station: Station | null;
  onFreqChange?: (f: number) => void;
  onDeleteBroken?: (id: string) => void;
}

type StreamStatus = 'idle' | 'loading' | 'playing' | 'error';

export default function Player({ station, onFreqChange, onDeleteBroken }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [volume, setVolume] = useState(70);
  const [freq, setFreq] = useState(station ? parseFloat(station.frequency) : 88.3);

  useEffect(() => {
    if (!station) return;
    const f = parseFloat(station.frequency);
    if (!isNaN(f)) setFreq(f);
    onFreqChange?.(f);
    // При смене станции — сбросить статус, остановить старый поток
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setStatus('idle');
  }, [station?.id]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const handlePlay = async () => {
    if (!station || !audioRef.current) return;

    if (status === 'playing') {
      audioRef.current.pause();
      setStatus('idle');
      return;
    }

    setStatus('loading');
    audioRef.current.src = station.url;
    audioRef.current.load();
    try {
      await audioRef.current.play();
      setStatus('playing');
    } catch {
      setStatus('error');
    }
  };

  const handleFreqChange = (v: number) => {
    setFreq(v);
    onFreqChange?.(v);
  };

  const isPlaying = status === 'playing';
  const isLoading = status === 'loading';
  const isError = status === 'error';

  return (
    <div className="wood-texture rounded-lg p-1" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
      <audio
        ref={audioRef}
        onEnded={() => setStatus('idle')}
        onError={() => setStatus('error')}
        onStalled={() => { if (status === 'loading') setStatus('error'); }}
      />

      <div className="rounded-md p-4" style={{ background: 'var(--wood-dark)' }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`rounded-full ${isPlaying ? 'animate-pulse-green' : ''}`}
              style={{
                width: 10, height: 10,
                background: isError ? '#ff4040' : isPlaying ? 'var(--green-indicator)' : 'var(--green-dim)',
                boxShadow: isError ? '0 0 8px #ff4040' : isPlaying ? '0 0 8px var(--green-indicator)' : 'none',
                transition: 'all 0.3s ease',
              }}
            />
            <span className="font-oswald text-xs tracking-widest uppercase" style={{ color: 'var(--amber-dim)' }}>
              Радиола ВЭФ-202
            </span>
          </div>
          <span className="font-mono text-[10px]" style={{ color: 'var(--amber-dim)' }}>
            СССР · ★
          </span>
        </div>

        {/* Frequency scale */}
        <div className="mb-4">
          <FrequencyScale value={freq} onChange={handleFreqChange} />
        </div>

        {/* Station display */}
        <div
          className="rounded mb-4 px-3 py-2 flex items-center justify-between"
          style={{
            background: 'var(--dial-bg)',
            border: `1px solid ${isError ? 'rgba(255,64,64,0.3)' : 'rgba(200,134,10,0.2)'}`,
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
            transition: 'border-color 0.3s',
          }}
        >
          <div className="flex-1 min-w-0">
            {station ? (
              <>
                <div
                  className={`font-oswald text-sm tracking-wider ${isPlaying ? 'animate-flicker' : ''}`}
                  style={{
                    color: isError ? '#ff8080' : 'var(--amber-glow)',
                    textShadow: isError ? '0 0 10px rgba(255,80,80,0.5)' : isPlaying ? '0 0 10px var(--amber-glow)' : 'none',
                  }}
                >
                  {station.name}
                </div>
                <div className="font-mono text-[10px] mt-0.5 flex items-center gap-2" style={{ color: 'var(--amber-dim)' }}>
                  <span>{station.genre} · {station.frequency} МГц</span>
                  {isError && (
                    <span style={{ color: '#ff6060' }}>· поток недоступен</span>
                  )}
                </div>
              </>
            ) : (
              <div className="font-mono text-xs" style={{ color: 'var(--amber-dim)', opacity: 0.5 }}>
                — выберите станцию —
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Кнопка удаления нерабочей станции */}
            {isError && station && onDeleteBroken && (
              <button
                onClick={() => onDeleteBroken(station.id)}
                className="flex items-center gap-1 px-2 py-1 rounded transition-all"
                style={{
                  background: 'rgba(255,60,60,0.12)',
                  border: '1px solid rgba(255,60,60,0.3)',
                  color: '#ff8080',
                  fontSize: 9,
                  fontFamily: 'Oswald, sans-serif',
                  letterSpacing: '0.05em',
                }}
                title="Удалить нерабочую станцию"
              >
                <Icon name="Trash2" size={10} />
                <span>удалить</span>
              </button>
            )}
            <VuMeter playing={isPlaying} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Play/Stop button */}
          <button
            onClick={handlePlay}
            disabled={!station}
            className="btn-retro rounded-full flex items-center justify-center disabled:opacity-30"
            style={{
              width: 52, height: 52,
              color: isError ? '#ff8080' : isPlaying ? 'var(--amber-glow)' : 'var(--amber-dim)',
              border: `1px solid ${isPlaying ? 'var(--amber-dim)' : isError ? 'rgba(255,80,80,0.4)' : '#444'}`,
              boxShadow: isPlaying
                ? '0 0 12px rgba(232,160,48,0.4), inset 0 2px 4px rgba(0,0,0,0.5)'
                : isError
                ? '0 0 8px rgba(255,60,60,0.2), inset 0 2px 4px rgba(0,0,0,0.5)'
                : '2px 2px 4px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)',
            }}
          >
            {isLoading ? (
              <div className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
            ) : isError ? (
              <Icon name="AlertTriangle" size={18} />
            ) : (
              <Icon name={isPlaying ? 'Square' : 'Play'} size={20} />
            )}
          </button>

          {/* Volume slider */}
          <div className="flex items-center gap-2 flex-1">
            <Icon name="Volume2" size={14} style={{ color: 'var(--amber-dim)' }} />
            <div className="flex-1 relative" style={{ height: 4 }}>
              <div className="absolute inset-0 rounded" style={{ background: '#1a1a1a', border: '1px solid #333' }} />
              <div
                className="absolute top-0 left-0 h-full rounded"
                style={{
                  width: `${volume}%`,
                  background: 'linear-gradient(90deg, var(--amber-dim), var(--amber))',
                  boxShadow: '0 0 6px rgba(232,160,48,0.4)',
                }}
              />
              <input
                type="range" min={0} max={100} value={volume}
                onChange={e => setVolume(+e.target.value)}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                style={{ height: '100%' }}
              />
            </div>
          </div>

          <div className="knob" style={{ width: 32, height: 32 }} title="Тембр" />
          <div className="knob" style={{ width: 28, height: 28 }} title="Баланс" />
        </div>
      </div>

      <div className="grille rounded-b-md mt-1" style={{ height: 24 }} />
    </div>
  );
}
