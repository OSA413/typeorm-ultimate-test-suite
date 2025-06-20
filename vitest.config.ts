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
        testTimeout: 90_000,
        reporters: ['json', 'default'],
        outputFile: "test-result.log"
    }
})