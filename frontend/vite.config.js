import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons.png"],
      manifest: {
        name: "My MERN App",
        short_name: "MyApp",
        description: "My MERN Progressive Web App",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
                {
        src: "/pwa2.png",
        sizes: "192x192",
        type: "image/png"
      },
        ],
        screenshots:[
              {
      src: "/pwa.png",
      sizes: "540x720",
      type: "image/png"
    }
        ]
      },
    }),
  ],
});
