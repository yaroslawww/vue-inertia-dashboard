import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const config = {
  dashboard: {
    name: 'vue-inertia-dashboard',
    entry: path.resolve(__dirname, 'src/main.js'),
    fileName: 'vue-inertia-dashboard',
  },
  lib: {
    name: 'vue-inertia-dashboard-lib',
    entry: path.resolve(__dirname, 'src/index.js'),
    fileName: 'lib',
  },
};

const currentConfig = config[process.env.LIB_NAME];

if (currentConfig === undefined) {
  throw new Error('LIB_NAME is not defined or is not valid');
}

export default defineConfig({
  build: {
    outDir: './dist',
    lib: {
      ...currentConfig,
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-form-kit',
        'lodash',
        '@inertiajs/inertia',
        '@inertiajs/inertia-vue3',
      ],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    emptyOutDir: false,
  },
  plugins: [vue()],
});
