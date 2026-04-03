import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  onChange: (v: number) => void;
}

const MIN = 65;
const MAX = 108;

// Города на шкале как на советских радиолах: частота → название
const CITIES: { freq: number; label: string }[] = [
  { freq: 66,  label: 'ВАРШ' },
  { freq: 70,  label: 'ЛОНД' },
  { freq: 74,  label: 'ПРАГА' },
  { freq: 78,  label: 'БЕРЛ' },
  { freq: 82,  label: 'ПАРИЖ' },
  { freq: 87,  label: 'МОСКВА' },
  { freq: 92,  label: 'РИГА' },
  { freq: 96,  label: 'КИЕВ' },
  { freq: 100, label: 'МИНСК' },
  { freq: 104, label: 'ТБИЛ' },
  { freq: 107, label: 'АЛМА' },
];

// Числовые метки между городами
const FREQ_TICKS = [68, 72, 76, 80, 84, 88, 90, 94, 98, 102, 106];

function freqToPct(f: number) {
  return ((f - MIN) / (MAX - MIN)) * 88 + 6;
}

export default function FrequencyScale({ value, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const needlePct = freqToPct(value);

  const getVal = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = MIN + ratio * (MAX - MIN);
    return Math.round(raw * 10) / 10;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    onChange(getVal(e.clientX));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    onChange(getVal(e.touches[0].clientX));
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => onChange(getVal(e.clientX));
    const touchMove = (e: TouchEvent) => onChange(getVal(e.touches[0].clientX));
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', touchMove);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('touchend', up);
    };
  }, [dragging]);

  return (
    <div
      className="freq-scale rounded select-none"
      style={{ height: 88, position: 'relative', overflow: 'hidden' }}
    >
      {/* Background glow под иглой */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${needlePct}%`,
          width: 40,
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse at center, rgba(245,192,96,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          transition: 'left 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      />

      {/* Города — верхний ряд */}
      <div style={{ position: 'absolute', top: 5, left: 0, right: 0 }}>
        {CITIES.map(({ freq, label }) => (
          <div
            key={freq}
            style={{
              position: 'absolute',
              left: `${freqToPct(freq)}%`,
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <span
              style={{
                fontFamily: 'Oswald, sans-serif',
                fontSize: 7,
                fontWeight: 500,
                color: 'var(--scale-line)',
                letterSpacing: '0.05em',
                lineHeight: 1,
                opacity: 0.9,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
            {/* Длинный тик под городом */}
            <div style={{ width: 1, height: 8, background: 'var(--scale-line)', opacity: 0.8 }} />
          </div>
        ))}
      </div>

      {/* Числовые тики — средний ряд */}
      <div style={{ position: 'absolute', top: 30, left: 0, right: 0 }}>
        {FREQ_TICKS.map(f => (
          <div
            key={f}
            style={{
              position: 'absolute',
              left: `${freqToPct(f)}%`,
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <div style={{ width: 1, height: 4, background: 'var(--scale-line)', opacity: 0.4 }} />
            <span
              style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: 7,
                color: 'var(--scale-line)',
                opacity: 0.5,
                lineHeight: 1,
              }}
            >
              {f}
            </span>
          </div>
        ))}
      </div>

      {/* Горизонтальная линия шкалы */}
      <div
        style={{
          position: 'absolute',
          top: 46,
          left: '6%',
          right: '6%',
          height: 1,
          background: 'rgba(200,134,10,0.25)',
        }}
      />

      {/* Интерактивная зона с иглой */}
      <div
        ref={trackRef}
        className="cursor-crosshair"
        style={{ position: 'absolute', top: 30, bottom: 0, left: 0, right: 0 }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {/* Игла */}
        <div
          className="needle"
          style={{
            left: `${needlePct}%`,
            top: 0,
            height: '100%',
          }}
        />

        {/* Частота над иглой */}
        <div
          className="animate-flicker"
          style={{
            position: 'absolute',
            top: 2,
            left: `${needlePct}%`,
            transform: 'translateX(-50%)',
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 10,
            fontWeight: 700,
            color: 'var(--amber-glow)',
            textShadow: '0 0 8px var(--amber-glow)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            transition: 'left 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {value.toFixed(1)}
        </div>
      </div>
    </div>
  );
}
