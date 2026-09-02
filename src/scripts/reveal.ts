/**
 * Последовательное появление шагов таймлайна при попадании в viewport.
 * Одноразово: после проигрывания наблюдение снимается.
 */

import { prefersReducedMotion } from './utils';

const STAGGER_MS = 70;
/** Элементы, попавшие в viewport в пределах этого окна, считаются одной пачкой. */
const BATCH_WINDOW_MS = 120;

export function initReveal(): void {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (items.length === 0) return;

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    for (const item of items) item.classList.add('is-revealed');
    return;
  }

  let batchStartedAt = 0;
  let batchIndex = 0;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const el = entry.target as HTMLElement;
        const now = performance.now();

        if (now - batchStartedAt > BATCH_WINDOW_MS) {
          batchStartedAt = now;
          batchIndex = 0;
        }

        el.style.setProperty('--reveal-delay', `${batchIndex * STAGGER_MS}ms`);
        el.classList.add('is-revealed');
        batchIndex += 1;

        observer.unobserve(el);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  for (const item of items) observer.observe(item);
}
