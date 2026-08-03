import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

export default function PageLoader() {
  const loc = useLocation();
  const [show, setShow] = useState(true);
  const prev = useRef(loc.pathname);
  const isFirst = useRef(true);

  useEffect(() => {
    if (loc.pathname.startsWith('/admin')) { setShow(false); return; }
    if (isFirst.current) {
      isFirst.current = false;
      setShow(true);
      const t = setTimeout(() => setShow(false), 2200);
      return () => clearTimeout(t);
    }
    if (loc.pathname !== prev.current) {
      prev.current = loc.pathname;
      setShow(true);
      const t = setTimeout(() => setShow(false), 1600);
      return () => clearTimeout(t);
    }
  }, [loc.pathname]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--bg-primary)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
          <div className="absolute h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
          <Logo size={110} animate showText={false} />
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }} className="mt-6">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-[var(--text-primary)]">Mohaan</span>
              <span className="text-brand-gradient">Web</span>
            </span>
          </motion.div>
          <motion.div className="mt-8 h-[2px] w-24 overflow-hidden rounded-full bg-[var(--border-primary)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <motion.div className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
