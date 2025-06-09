import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server:{
      cors: false,
      host: true, // Allow access from other devices on the network
      port: 3000, 
    }

  },
  middleware: "src/middleware/index.ts",

});
