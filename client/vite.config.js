import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import envPlugin from 'vite-plugin-env';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    envPlugin(),
  ],
});
