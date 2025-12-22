import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc';

export default defineConfig({
    esbuild: false,
    plugins: [
        swc.vite(),
    ],
    test: {
        maxWorkers: 8,
        maxConcurrency: 16,
        globalSetup: 'vitest.global-setup.ts',
        testTimeout: 90_000,
        reporters: ['json', 'default'],
        outputFile: "test-result.log",
        hookTimeout: 30_000, // in case if you want to log and pass the database seeding
    }
})