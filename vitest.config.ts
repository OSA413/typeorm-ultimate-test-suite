import { defineConfig } from 'vitest/config'
import { swc } from 'rollup-plugin-swc3';

export default defineConfig({
    esbuild: false,
    plugins: [
        swc(),
    ],
    test: {
        bail: 1,
    }
})