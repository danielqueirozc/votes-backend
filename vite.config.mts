import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

// configurei isso para o vitest entender automaticamnete o caminho com @
export default defineConfig({
    plugins: [tsconfigPaths()],
})  