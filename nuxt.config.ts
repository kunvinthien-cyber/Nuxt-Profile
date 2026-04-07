export default defineNuxtConfig({
  nitro: {
    preset: 'vercel' // ✅ FIXED
  },

  ssr: true,

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      appName: process.env.APP_NAME || 'NexusApp',
    },
  },

  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
  ],

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/register', '/login'],
    }
  },

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
  },

  compatibilityDate: '2024-04-03',
})