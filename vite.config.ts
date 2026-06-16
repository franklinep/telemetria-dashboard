import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/telemetria-dashboard/' : '/',
  test: {
    environment: 'node',
  },
}));
