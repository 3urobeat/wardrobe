import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    compatibilityDate: "2025-09-08",
    css: ["~/pages/main.css"],
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
    srcDir: "src/",
    serverDir: "src/server",
    dir: {
        public: "src/public",
        modules: "src/modules",
        shared: "src/shared",
    },
    hooks: {
        "pages:extend"(pages) {

            // Re-Route index to clothing subdirectory
            pages.push({
                name: "index",
                path: "/",
                file: "~/pages/clothing/index.vue"
            });

            // Re-Route outfits/edit to outfits/view and toggle components to re-use code
            pages.push({
                name: "outfits-edit",
                path: "/outfits/edit",
                file: "~/pages/outfits/view.vue"
            });

        }
    }
});
