// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-12-17',
  experimental: {
    appManifest: false
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxtjs/sitemap'
  ],
  site: {
    url: 'https://www.nickscoding.website',
    name: "Nick's Coding Website"
  },
  googleFonts: {
    families: {
      "Exo+2": {
        ital: [700],
      },
      "Ubuntu+Mono": true,
    }
  },
  app: {
    head: {
      title: "Nick's Coding Website",
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Nicholas Harding — C++ and Unreal Engine developer based in Christchurch, NZ. Portfolio showcasing large-scale crowd simulation, VR experiences, and real-time 3D applications.' },
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: "Nick's Coding Website" },
        { property: 'og:locale', content: 'en_NZ' },
        { name: 'twitter:card', content: 'summary' },
        {
          'http-equiv': 'Content-Security-Policy',
          content: "default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:; font-src 'self' https: data:;"
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  }
})
