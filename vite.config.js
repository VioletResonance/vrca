import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import { viteSingleFile } from 'vite-plugin-singlefile';

import autoprefixer from 'autoprefixer';
import postcssSortMediaQueries from 'postcss-sort-media-queries';

import { viteMoveScripts } from './vite/plugins/vite-plugin-move-scripts';
import { viteRenameFiles } from './vite/plugins/vite-plugin-rename-files';
import { viteStripHtmlComments } from './vite/plugins/vite-plugin-strip-html-comments';

import pkg from './package.json';

export default defineConfig({
  root: 'src',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsInlineLimit: 0
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: ['last 2 versions,> 0.5%, Firefox ESR, not dead']
        }),
        postcssSortMediaQueries()
      ]
    }
  },
  plugins: [
    eslint(),
    viteMoveScripts(),
    viteSingleFile({
      useRecommendedBuildConfig: false,
      inlinePattern: ['**/*.js', '**/*.css']
    }),
    viteStripHtmlComments({
      targets: ['dist/index.html']
    }),
    viteRenameFiles({
      targets: [
        {
          from: 'dist/index.html',
          to: 'dist/avatars.html'
        }
      ]
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 3001,
    open: 'avatars.html'
  },
  define: {
    __VERSION__: JSON.stringify(pkg.version)
  }
});
