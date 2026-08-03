import { useMemo } from 'react';

export default function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 12}s`,
      dur: `${10 + Math.random() * 14}s`,
      size: 1 + Math.random() * 2,
      opacity: 0.12 + Math.random() * 0.25,
      color: i % 3 === 0 ? 'rgba(56,189,248,0.5)' : i % 3 === 1 ? 'rgba(129,140,248,0.4)' : 'rgba(192,132,252,0.35)',
    })), []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            background: p.color,
            animationDelay: p.delay,
            animationDuration: p.dur,
          }}
        />
      ))}
    </div>
  );
}
