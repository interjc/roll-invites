// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  runtimeConfig: {
    // 服务器端可以访问的私有键
    secretCode: process.env.SECRET_CODE,
    secretInfo: process.env.SECRET_INFO,
  },
});
