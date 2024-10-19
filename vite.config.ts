import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";


// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   host: "127.0.0.1",
  // },
  base: "/web-llm-on-react/",
  plugins: [react(), tsconfigPaths()],
});

