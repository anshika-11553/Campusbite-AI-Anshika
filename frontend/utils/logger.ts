const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.log('[CampusBite LOG]:', ...args);
    }
  },
  warn: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.warn('[CampusBite WARN]:', ...args);
    }
  },
  error: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.error('[CampusBite ERROR]:', ...args);
    }
  },
};
