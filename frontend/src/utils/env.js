const LEVELS = ['error', 'warn', 'info', 'debug'];

function getEnv(name, fallback) {
  return (process.env && process.env[name]) || fallback;
}

// PUBLIC_INTERFACE
export function getApiBase() {
  /** Returns API base URL: REACT_APP_API_BASE -> REACT_APP_BACKEND_URL -> http://localhost:3001/api */
  const base = getEnv('REACT_APP_API_BASE');
  const be = getEnv('REACT_APP_BACKEND_URL');
  // Remove a single trailing slash safely; avoid invalid flags in old parsers by using string check
  const normalized = be ? (be.endsWith('/') ? be.slice(0, -1) : be) : null;
  return base || (normalized ? `${normalized}/api` : 'http://localhost:3001/api');
}

// PUBLIC_INTERFACE
export function getFeatureFlags() {
  /** Parses REACT_APP_FEATURE_FLAGS and REACT_APP_EXPERIMENTS_ENABLED to boolean flags. */
  const raw = getEnv('REACT_APP_FEATURE_FLAGS', '');
  const map = {};
  raw.split(',').map(s => s.trim()).filter(Boolean).forEach(pair => {
    const [k, v] = pair.split('=');
    map[k] = (v ?? 'true').toLowerCase() === 'true';
  });
  map.EXPERIMENTS_ENABLED = (getEnv('REACT_APP_EXPERIMENTS_ENABLED', 'false') || 'false').toLowerCase() === 'true';
  return map;
}

function currentLevelIndex() {
  const lvl = getEnv('REACT_APP_LOG_LEVEL', getEnv('REACT_APP_NODE_ENV', 'development') === 'development' ? 'debug' : 'info').toLowerCase();
  const idx = LEVELS.indexOf(lvl);
  return idx === -1 ? LEVELS.indexOf('info') : idx;
}

function logAt(level, ...args) {
  const idx = LEVELS.indexOf(level);
  if (idx <= currentLevelIndex()) {
    // eslint-disable-next-line no-console
    console[level](...args);
  }
}

// PUBLIC_INTERFACE
export const logger = {
  /** Logger that respects REACT_APP_LOG_LEVEL and REACT_APP_NODE_ENV. */
  error: (...a) => logAt('error', '[APP]', ...a),
  warn: (...a) => logAt('warn', '[APP]', ...a),
  info: (...a) => logAt('info', '[APP]', ...a),
  debug: (...a) => logAt('debug', '[APP]', ...a),
};
