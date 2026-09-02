// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://xn----etbdepnacug3am8a9c.xn--p1ai',
  // Панель разработчика Astro перекрывает нижний край макета при проверке вёрстки.
  devToolbar: { enabled: false },
  build: {
    // Один CSS-файл на страницу: лендинг одностраничный, критичен первый рендер.
    inlineStylesheets: 'auto',
  },
});
