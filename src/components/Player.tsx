import { useRef, useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import FrequencyScale from './FrequencyScale';
import VuMeter from './VuMeter';
import { Station } from '@/data/stations';

interface Props {
  station: Station | null;
  onFreqChange?: (f: number) => void;
}

export default function Player({ station, onFreqChange }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [freq, setFreq] = useState(station ? parseFloat(station.frequency) : 88.3);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!station) return;
    const f = parseFloat(station.frequency);
    setFreq(f);
    onFreqChange?.(f);
  }, [station]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlay = async () => {
    if (!station || !audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      setLoading(true);
      audioRef.current.src = station.url;
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
      setLoading(false);
    }
  };

  const handleFreqChange = (v: number) => {
    setFreq(v);
    onFreqChange?.(v);
  };

  return (
    <div className="wood-texture rounded-lg p-1" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
      <audio ref={audioRef} onEnded={() => setPlaying(false)} />

      {/* Top panel */}
      <div className="rounded-md p-4" style={{ background: 'var(--wood-dark)' }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* Power indicator */}
            <div
              className={`rounded-full ${playing ? 'animate-pulse-green' : ''}`}
              style={{
                width: 10,
                height: 10,
                background: playing ? 'var(--green-indicator)' : 'var(--green-dim)',
                boxShadow: playing ? '0 0 8px var(--green-indicator)' : 'none',
                transition: 'all 0.3s ease',
              }}
            />
            <span className="font-oswald text-xs tracking-widest uppercase" style={{ color: 'var(--amber-dim)' }}>
              Радиола ВЭФ-202
            </span>
          </div>
          <span className="font-mono text-[10px]" style={{ color: 'var(--amber-dim)' }}>
            СССР · {new Date().getFullYear() > 1991 ? '★' : new Date().getFullYear()}
          </span>
        </div>

        {/* Frequency scale */}
        <div className="mb-4">
          <FrequencyScale value={freq} onChange={handleFreqChange} />
        </div>

        {/* Station name display */}
        <div
          className="rounded mb-4 px-3 py-2 flex items-center justify-between"
          style={{
            background: 'var(--dial-bg)',
            border: '1px solid rgba(200,134,10,0.2)',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
          }}
        >
          <div>
            {station ? (
              <>
                <div
                  className="font-oswald text-sm tracking-wider animate-flicker"
                  style={{ color: 'var(--amber-glow)', textShadow: '0 0 10px var(--amber-glow)' }}
                >
                  {station.name}
                </div>
                <div className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--amber-dim)' }}>
                  {station.genre} · {station.frequency} МГц
                </div>
              </>
            ) : (
              <div className="font-mono text-xs" style={{ color: 'var(--amber-dim)', opacity: 0.5 }}>
                — выберите станцию —
              </div>
            )}
          </div>
          <VuMeter playing={playing} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Play button */}
          <button
            onClick={handlePlay}
            disabled={!station}
            className="btn-retro rounded-full flex items-center justify-center disabled:opacity-30"
            style={{
              width: 52,
              height: 52,
              color: playing ? 'var(--amber-glow)' : 'var(--amber-dim)',
              border: `1px solid ${playing ? 'var(--amber-dim)' : '#444'}`,
              boxShadow: playing
                ? '0 0 12px rgba(232,160,48,0.4), inset 0 2px 4px rgba(0,0,0,0.5)'
                : '2px 2px 4px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)',
            }}
          >
            {loading ? (
              <div className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
            ) : (
              <Icon name={playing ? 'Square' : 'Play'} size={20} />
            )}
          </button>

          {/* Volume knob area */}
          <div className="flex items-center gap-2 flex-1">
            <Icon name="Volume2" size={14} style={{ color: 'var(--amber-dim)' }} />
            <div className="flex-1 relative" style={{ height: 4 }}>
              <div className="absolute inset-0 rounded" style={{ background: '#1a1a1a', border: '1px solid #333' }} />
              <div
                className="absolute top-0 left-0 h-full rounded"
                style={{
                  width: `${volume}%`,
                  background: `linear-gradient(90deg, var(--amber-dim), var(--amber))`,
                  boxShadow: '0 0 6px rgba(232,160,48,0.4)',
                }}
              />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={e => setVolume(+e.target.value)}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
                style={{ height: '100%' }}
              />
            </div>
          </div>

          {/* Tone knob mockup */}
          <div className="knob" style={{ width: 32, height: 32 }} title="Тембр" />
          <div className="knob" style={{ width: 28, height: 28 }} title="Баланс" />
        </div>
      </div>

      {/* Speaker grille bottom strip */}
      <div className="grille rounded-b-md mt-1" style={{ height: 24 }} />
    </div>
  );
}
