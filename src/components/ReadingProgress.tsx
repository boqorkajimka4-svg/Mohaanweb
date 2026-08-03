import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const top = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, (top / height) * 100) : 0);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.div
      className="fixed left-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500"
      style={{ width: `${progress}%` }}
      transition={{ duration: 0.1 }}
    />
  );
}
