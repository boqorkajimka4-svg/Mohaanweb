import supabase from './supabase';

async function getToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function req(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const raw = await res.text();

  let body: any = {};

  if (raw.trim()) {
    try {
      body = JSON.parse(raw);
    } catch {
      body = { error: raw };
    }
  }

  if (!res.ok) {
    throw new Error(
      body?.error ||
      body?.message ||
      `Request failed: ${res.status}`
    );
  }

  return body;
}
async function authReq(url: string, method: string, body: unknown) {
  const token = await getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return req(url, { method, headers, body: JSON.stringify(body) });
}

export const api = {
  categories: {
    list: () => req('/api/categories'),
    get: (slug: string) => req(`/api/categories?slug=${encodeURIComponent(slug)}`),
    create: (b: unknown) => authReq('/api/categories', 'POST', b),
    update: (b: unknown) => authReq('/api/categories', 'PUT', b),
    remove: (id: number) => authReq('/api/categories', 'DELETE', { id }),
  },
  products: {
    list: (params?: Record<string, string>) => req('/api/products' + (params ? '?' + new URLSearchParams(params) : '')),
    get: (slug: string) => req(`/api/products?slug=${encodeURIComponent(slug)}`),
    create: (b: unknown) => authReq('/api/products', 'POST', b),
    update: (b: unknown) => authReq('/api/products', 'PUT', b),
    remove: (id: number) => authReq('/api/products', 'DELETE', { id }),
  },
  articles: {
    list: (all?: boolean) => req('/api/articles' + (all ? '?all=true' : '')),
    get: (slug: string) => req(`/api/articles?slug=${encodeURIComponent(slug)}`),
    create: (b: unknown) => authReq('/api/articles', 'POST', b),
    update: (b: unknown) => authReq('/api/articles', 'PUT', b),
    remove: (id: number) => authReq('/api/articles', 'DELETE', { id }),
  },
  sections: {
    list: (all?: boolean) => req('/api/sections' + (all ? '?all=true' : '')),
    create: (b: unknown) => authReq('/api/sections', 'POST', b),
    update: (b: unknown) => authReq('/api/sections', 'PUT', b),
    remove: (id: number) => authReq('/api/sections', 'DELETE', { id }),
  },
  nav: {
    list: () => req('/api/nav'),
    listAll: () => req('/api/nav?all=true'),
    create: (b: unknown) => authReq('/api/nav', 'POST', b),
    update: (b: unknown) => authReq('/api/nav', 'PUT', b),
    remove: (id: number) => authReq('/api/nav', 'DELETE', { id }),
  },
  settings: {
    get: () => req('/api/settings'),
    update: (b: unknown) => authReq('/api/settings', 'PUT', b),
  },
  seo: {
    list: () => req('/api/seo'),
    get: (page: string) => req(`/api/seo?page=${encodeURIComponent(page)}`),
    upsert: (b: unknown) => authReq('/api/seo', 'POST', b),
  },
  media: {
    list: () => req('/api/media'),
    remove: (id: number, path: string) => authReq('/api/media', 'DELETE', { id, path }),
  },
  upload: async (fileName: string, fileBase64: string, contentType: string) => {
    const token = await getToken();

    if (!token) {
      throw new Error('Your admin session has expired. Please sign in again.');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    return req('/api/upload', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        fileName,
        fileBase64,
        contentType,
      }),
    });
  },
  contact: {
    list: () => req('/api/contact'),
    send: (b: unknown) => req('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }),
    remove: (id: number) => authReq('/api/contact', 'DELETE', { id }),
  },
};


