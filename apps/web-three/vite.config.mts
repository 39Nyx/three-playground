import { defineConfig } from '@vben/vite-config';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const commit = spawnSync('git', ['rev-parse', '--short=7', 'HEAD'])
  .stdout.toString()
  .trim()


function copyVuePlugin(): Plugin {
  return {
    name: 'copy-vue',
    generateBundle() {
      const copyFile = (file: string) => {
        const filePath = path.resolve(__dirname, './node_modules', file)
        const basename = path.basename(file)
        if (!fs.existsSync(filePath)) {
          throw new Error(
            `${basename} not built. ` +
            `Run "nr build vue -f esm-browser" first.`,
          )
        }
        this.emitFile({
          type: 'asset',
          fileName: basename,
          source: fs.readFileSync(filePath, 'utf-8'),
        })
      }

      copyFile(`vue/dist/vue.esm-browser.js`)
      copyFile(`vue/dist/vue.esm-browser.prod.js`)
      copyFile(`vue/dist/vue.runtime.esm-browser.js`)
      copyFile(`vue/dist/vue.runtime.esm-browser.prod.js`)
      copyFile(`@vue/server-renderer/dist/server-renderer.esm-browser.js`)
    },
  }
}

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
      },
      plugins: [
        copyVuePlugin(),
      ],
      define: {
        __COMMIT__: JSON.stringify(commit),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(true),
      },
      optimizeDeps: {
        exclude: ['@vue/repl'],
      },
    },
  };
});

