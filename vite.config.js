import { defineConfig, splitVendorChunkPlugin } from "vite"
import react from "@vitejs/plugin-react"
import Icons from "unplugin-icons/vite"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/qmk-rgb-matrix-configurator/",
  build: {
    sourcemap: true,
  },
  plugins: [
    splitVendorChunkPlugin(),
    react({}),
    Icons({ compiler: "jsx", jsx: "react" }),
  ],
})
