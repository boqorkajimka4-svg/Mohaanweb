import { motion } from 'framer-motion';

interface LogoProps {
  size?: number;
  animate?: boolean;
  showText?: boolean;
}

export default function Logo({ size = 42, animate = false, showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-3 select-none">
      <motion.div
        style={{ width: size, height: size }}
        className="relative"
        initial={animate ? { rotate: 0, scale: 0.5, opacity: 0 } : false}
        animate={animate ? { rotate: 360, scale: 1, opacity: 1 } : {}}
        transition={animate ? { duration: 2.8, ease: [0.22, 1, 0.36, 1] } : {}}
      >
        <svg viewBox="0 0 100 100" width={size} height={size} className="drop-shadow-[0_0_16px_rgba(56,189,248,0.5)]">
          <defs>
            <linearGradient id="lg-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="none" stroke="url(#lg-grad)" strokeWidth="5" strokeDasharray="200 40" strokeLinecap="round" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="url(#lg-grad)" strokeWidth="3" strokeDasharray="120 60" strokeLinecap="round" opacity="0.5" />
          <text x="50" y="64" textAnchor="middle" fontSize="42" fontWeight="800" fill="url(#lg-grad)" fontFamily="Space Grotesk, sans-serif">M</text>
        </svg>
      </motion.div>
      {showText && (
        <span className="text-lg font-extrabold tracking-tight">
          <span className="text-[var(--text-primary)]">Mohaan</span>
          <span className="text-brand-gradient">Web</span>
        </span>
      )}
    </div>
  );
}
