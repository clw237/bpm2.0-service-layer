/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import dns from 'dns';
import { KF1ModuleFederation } from 'kfone-module-federation';
import { UserConfig, defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

dns.setDefaultResultOrder('verbatim');

const headersConfig = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
};

const portConfig = { port: 8082, strictPort: true };

// https://vitejs.dev/config/
export default defineConfig(async ({}): Promise<UserConfig> => {
  return {
    plugins: [
      dts(),
      react(),
      tsconfigPaths(),
      await KF1ModuleFederation({
        injectModuleRegistry: true,
        injectEnvVariables: true,
        moduleFederationConfig: {
          name: 'remote_app',
          exposes: {
            './Introduction': './src/exports/introduction/index.tsx',
            './RemotePage': './src/exports/pricing/index.tsx',
          },
        },
      }),
    ],
    optimizeDeps: {
      exclude: ['__federation__'],
    },
    preview: {
      host: 'localhost',
      headers: headersConfig,
      ...portConfig,
    },
    build: {
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
      outDir: './dist',
    },
    publicDir: './public',
    server: {
      open: true,
      headers: headersConfig,
      ...portConfig,
    },
    cacheDir: 'node_modules/.cacheDir',
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./setupTests.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          '**/node_modules/**',
          '**/dist/**',
          '**/build/**',
          '**/public/**',
          '**/src/model/**',
          'setupTests.ts',
          '*.config.{js,ts}',
        ],
        include: ['src/**/*.{ts,tsx,js}'],
      },
    },
  };
});
