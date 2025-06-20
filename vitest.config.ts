import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc';

export default defineConfig({
    esbuild: false,
    plugins: [
        swc.vite(),
    ],
    test: {
        bail: 1,
        globalSetup: 'vitest.global-setup.ts',
    }
})