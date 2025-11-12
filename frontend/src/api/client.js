import { getApiBase, logger } from '../utils/env';

// PUBLIC_INTERFACE
export function buildFetch(url, options = {}) {
  /** Thin wrapper over fetch with base URL and JSON handling. */
  const base = getApiBase();
  const full = url.startsWith('http') ? url : `${base}${url}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const opts = { ...options, headers };
  return fetch(full, opts).then(async (res) => {
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const err = new Error(data?.message || `HTTP ${res.status}`);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return { data, status: res.status };
  }).catch((e) => {
    logger.error('API error', e);
    throw e;
  });
}

function withAuth(options = {}) {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return options;
    return {
      ...options,
      headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
    };
  } catch {
    return options;
  }
}

const client = {
  get: (url, options) => buildFetch(url, withAuth({ method: 'GET', ...(options || {}) })),
  post: (url, body, options) => buildFetch(url, withAuth({ method: 'POST', body: body ? JSON.stringify(body) : undefined, ...(options || {}) })),
  put: (url, body, options) => buildFetch(url, withAuth({ method: 'PUT', body: body ? JSON.stringify(body) : undefined, ...(options || {}) })),
  delete: (url, options) => buildFetch(url, withAuth({ method: 'DELETE', ...(options || {}) })),
};

export default client;
