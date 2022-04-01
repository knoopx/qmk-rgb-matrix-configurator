import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import Icons from "unplugin-icons/vite"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    minify: "terser",
  },
  base: "/qmk-rgb-matrix-configurator/",
  plugins: [react(), Icons({ compiler: "jsx", jsx: "react" })],
})
