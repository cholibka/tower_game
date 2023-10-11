import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/tower_game/",
    plugins: [
        react({
            include: "**/*.jsx",
        }),
    ],
});
