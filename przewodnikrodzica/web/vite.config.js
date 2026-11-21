import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Backend .NET startuje na porcie 5117 (Properties/launchSettings.json, profil "http").
    // Wcześniej był tu port 5000, przez co frontend pokazywał "API not reachable".
    proxy: { "/api": "http://localhost:5117" },
  },
});
