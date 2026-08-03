import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const shapes = [
  { size: 280, top: '6%', left: '4%', from: '#38bdf8', to: '#818cf8', dur: 16, blur: 70, depth: 30 },
  { size: 220, top: '50%', left: '76%', from: '#c084fc', to: '#f472b6', dur: 20, blur: 80, depth: 45 },
  { size: 160, top: '70%', left: '10%', from: '#34d399', to: '#38bdf8', dur: 18, blur: 50, depth: 20 },
  { size: 180, top: '20%', left: '82%', from: '#818cf8', to: '#c084fc', dur: 22, blur: 60, depth: 35 },
  { size: 120, top: '85%', left: '55%', from: '#f472b6', to: '#fb923c', dur: 24, blur: 45, depth: 15 },
];

export default function FloatingObjects() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;
    const handler = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
      });
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => { window.removeEventListener('mousemove', handler); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: s.size, height: s.size, top: s.top, left: s.left,
            background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
            filter: `blur(${s.blur}px)`, opacity: 0.2,
            transform: `translate(${mouse.x * s.depth}px, ${mouse.y * s.depth}px)`,
          }}
          animate={{ y: [0, -35, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
        />
      ))}
    </div>
  );
}
