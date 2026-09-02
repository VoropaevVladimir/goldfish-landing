/**
 * Лёгкий parallax hero: фон смещается медленнее контента.
 * Сдвиг делаем через transform (не background-position) и отключаем
 * при prefers-reduced-motion.
 */

import { onScrollFrame, prefersReducedMotion } from './utils';

/** Доля высоты hero, на которую уезжает фон. Согласована с запасом в CSS
 *  (.hero__media: top -22%, height 122%). */
const SHIFT_RATIO = 0.22;

export function initParallax(): void {
  const media = document.querySelector<HTMLElement>('[data-parallax]');
  if (!media) return;

  const hero = media.closest<HTMLElement>('section');
  if (!hero) return;

  if (prefersReducedMotion()) return;

  onScrollFrame(() => {
    const height = hero.offsetHeight;
    if (height === 0) return;

    // Прогресс ухода hero за верхнюю кромку: 0 → 1.
    const progress = Math.min(Math.max(window.scrollY / height, 0), 1);
    media.style.transform = `translate3d(0, ${(progress * SHIFT_RATIO * height).toFixed(2)}px, 0)`;
  });
}
