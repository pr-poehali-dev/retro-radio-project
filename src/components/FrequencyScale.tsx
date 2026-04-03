import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  onChange: (v: number) => void;
}

const MARKS = [65, 70, 75, 80, 88, 95, 100, 104, 108];

export default function FrequencyScale({ value, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const MIN = 65;
  const MAX = 108;
  const pct = ((value - MIN) / (MAX - MIN)) * 90 + 5;

  const getVal = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round((MIN + ratio * (MAX - MIN)) * 10) / 10;
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    onChange(getVal(e.clientX));
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => onChange(getVal(e.clientX));
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [dragging]);

  return (
    <div className="freq-scale rounded px-3 pt-2 pb-4 select-none" style={{ height: 80 }}>
      {/* Scale labels */}
      <div className="relative flex justify-between mb-1" style={{ marginLeft: '5%', marginRight: '5%' }}>
        {MARKS.map(m => (
          <span key={m} className="font-mono text-[9px]" style={{ color: 'var(--scale-line)', lineHeight: 1 }}>
            {m}
          </span>
        ))}
      </div>

      {/* Tick marks */}
      <div className="relative flex justify-between mb-2" style={{ marginLeft: '5%', marginRight: '5%' }}>
        {MARKS.map((m, i) => (
          <div key={m} className="flex flex-col items-center gap-0.5">
            <div style={{ width: 1, height: i % 2 === 0 ? 10 : 6, background: 'var(--scale-line)', opacity: 0.7 }} />
          </div>
        ))}
      </div>

      {/* Track with needle */}
      <div
        ref={trackRef}
        className="relative cursor-crosshair"
        style={{ height: 30, marginTop: -4 }}
        onMouseDown={onMouseDown}
      >
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2" style={{ height: 1, background: 'rgba(200,134,10,0.3)' }} />
        <div
          className="needle"
          style={{
            left: `${pct}%`,
            top: 0,
            bottom: 0,
            height: '100%',
          }}
        />
        {/* Frequency display */}
        <div
          className="absolute -top-1 font-mono text-xs font-bold animate-flicker"
          style={{
            left: `${pct}%`,
            transform: 'translateX(-50%)',
            color: 'var(--amber-glow)',
            textShadow: '0 0 8px var(--amber-glow)',
            bottom: 'auto',
            top: -2,
            pointerEvents: 'none',
            fontSize: 10,
          }}
        >
          {value.toFixed(1)}
        </div>
      </div>
    </div>
  );
}
