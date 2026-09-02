/** Общие помощники для клиентских скриптов. */

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Троттлинг обработчика скролла через rAF: не чаще одного кадра. */
export function onScrollFrame(handler: () => void): () => void {
  let ticking = false;

  const listener = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      handler();
      ticking = false;
    });
  };

  window.addEventListener('scroll', listener, { passive: true });
  handler();

  return () => window.removeEventListener('scroll', listener);
}

export function cssVarPx(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
}
