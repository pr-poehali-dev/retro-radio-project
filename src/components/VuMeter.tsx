import { useEffect, useState } from 'react';

interface Props {
  playing: boolean;
}

export default function VuMeter({ playing }: Props) {
  const [levels, setLevels] = useState([0, 0]);

  useEffect(() => {
    if (!playing) {
      setLevels([0, 0]);
      return;
    }
    const interval = setInterval(() => {
      setLevels([
        Math.random() * 70 + 20,
        Math.random() * 70 + 20,
      ]);
    }, 120);
    return () => clearInterval(interval);
  }, [playing]);

  const bars = 12;

  return (
    <div className="flex flex-col gap-1">
      {levels.map((level, ch) => (
        <div key={ch} className="flex items-center gap-0.5">
          <span className="font-mono text-[8px] w-3" style={{ color: 'var(--amber-dim)' }}>
            {ch === 0 ? 'Л' : 'П'}
          </span>
          <div className="flex gap-px" style={{ height: 8 }}>
            {Array.from({ length: bars }).map((_, i) => {
              const threshold = (i / bars) * 100;
              const isLit = threshold < level;
              const isRed = i >= bars - 2;
              const isYellow = i >= bars - 4 && i < bars - 2;
              return (
                <div
                  key={i}
                  style={{
                    width: 7,
                    height: '100%',
                    borderRadius: 1,
                    transition: 'opacity 0.08s ease',
                    opacity: isLit ? 1 : 0.12,
                    background: isRed
                      ? '#ff3333'
                      : isYellow
                      ? '#ffaa00'
                      : 'var(--green-indicator)',
                    boxShadow: isLit
                      ? isRed
                        ? '0 0 4px #ff3333'
                        : isYellow
                        ? '0 0 4px #ffaa00'
                        : '0 0 4px var(--green-indicator)'
                      : 'none',
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
