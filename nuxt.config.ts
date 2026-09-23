// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'

// Tailwind 4 writes each theme colour with an opacity (e.g. bg-black/90) twice: a hex
// fallback, then a color-mix(in oklab) copy for browsers that support it. Browsers fade
// between oklab colours in a different colour space, so hover and focus fades from these
// colours would look different part-way through. The production build drops the oklab
// copies, so every browser uses the hex values, the same as Tailwind 3's. (`nuxt dev` still
// fades the Tailwind 4 way; check fades on a generated build.) Copies based on currentColor
// or a CSS variable are kept, because their fallback has no transparency.
function hexOpacityColours(): Plugin {
  const block = /@supports\s*\(\s*color:\s*color-mix\(\s*in lab,\s*red,\s*red\s*\)\s*\)\s*\{/g
  return {
    name: 'hex-opacity-colours',
    apply: 'build',
    transform(code, id) {
      if (!/\.css($|\?)/.test(id) || !code.includes('color-mix(in lab')) return
      let out = ''
      let last = 0
      block.lastIndex = 0
      for (let match = block.exec(code); match; match = block.exec(code)) {
        let end = block.lastIndex
        for (let depth = 1; depth > 0 && end < code.length; end++) {
          if (code[end] === '{') depth++
          else if (code[end] === '}') depth--
        }
        block.lastIndex = end
        if (/currentcolor|var\(--(?!color-)/i.test(code.slice(match.index, end))) continue
        out += code.slice(last, match.index)
        last = end
      }
      return { code: out + code.slice(last), map: { mappings: '' } }
    }
  }
}

export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-12-17',
  experimental: {
    appManifest: false,
    // Nuxt 4 would load the entry chunk through an import map, which browsers without
    // import map support (e.g. Safari before 16.4) can't run. Keep the Nuxt 3 behaviour.
    entryImportMap: false
  },
  features: {
    // Nuxt 4 stopped inlining global CSS (Tailwind) into the page; keep the Nuxt 3 output.
    inlineStyles: true
  },
  // Minify CSS with esbuild, as the Nuxt 3 build (Vite 7) did, instead of cssnano 8 (Nuxt 4's
  // CSS optimiser). This began because cssnano 8 broke Tailwind 3's empty `--tw-*: ;`
  // variables. Tailwind 4 no longer writes those, but the site's look was checked against
  // the esbuild output, so the build keeps using it.
  postcss: {
    plugins: {
      cssnano: false
    }
  },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss(), hexOpacityColours()],
    build: {
      cssMinify: 'esbuild'
    }
  },
  hooks: {
    // The game page loads its own audio when it opens. Prefetching it as well would make
    // visitors download the (large) background music twice.
    'build:manifest'(manifest) {
      for (const entry of Object.values(manifest)) {
        if (entry.resourceType === 'audio') entry.prefetch = false
      }
    },
  },
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/sitemap'
  ],
  routeRules: {
    // @nuxtjs/sitemap 7 added this header for the sitemap's stylesheet; version 8 only sets
    // it when a server renders the file, and this site is static. Keep serving it the same.
    '/__sitemap__/style.xsl': { headers: { 'Content-Type': 'application/xslt+xml' } }
  },
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
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  }
})
