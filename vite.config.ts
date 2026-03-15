import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { viteStaticCopy } from "vite-plugin-static-copy";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "online-zoo",
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "assets/images/**/*", dest: "assets/images" },
        { src: "assets/icons/**/*", dest: "assets/icons" },
      ],
    }),
  ],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "online-zoo/index.html"),
        "pages/landing/index": path.resolve(__dirname, "online-zoo/pages/landing/index.html"),
        "pages/map/index": path.resolve(__dirname, "online-zoo/pages/map/index.html"),
        "pages/contact/index": path.resolve(__dirname, "online-zoo/pages/contact/index.html"),
        "pages/animal/index": path.resolve(__dirname, "online-zoo/pages/animal/index.html"),
      },
    },
  },
});
