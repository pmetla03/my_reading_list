export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  colorMode: {
    preference: "light",
  },
  ui: {
    icons: ['heroicons', 'carbon'],
  },
});
