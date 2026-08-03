import { useState, useEffect } from 'react';
import { api } from './api';
import type { SiteSettings } from './types';

let cache: SiteSettings | null = null;

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(cache);
  useEffect(() => {
    if (cache) return;
    api.settings.get().then((d) => { cache = d; setSettings(d); }).catch(() => {});
  }, []);
  return settings;
}
