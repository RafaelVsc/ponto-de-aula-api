import path from 'node:path';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { 'main/server': 'src/main/server.ts' },
  format: ['cjs'],
  platform: 'node',
  target: 'node20',
  sourcemap: true,
  splitting: false,
  dts: false,
  clean: true,
  loader: {
    '.prisma': 'file',
    '.wasm': 'file',
  },
  esbuildOptions(options) {
    options.plugins = [
      ...(options.plugins ?? []),
      {
        name: 'prisma-client-path',
        setup(build) {
          build.onResolve({ filter: /^@\/generated\/prisma\/client$/ }, () => ({
            path: '../client',
            external: true,
          }));
        },
      },
    ];
  },
  publicDir: 'src/generated/prisma',
});
