/**
 * Плавное появление lazy-фото после реальной загрузки (см. global.css,
 * .photo > picture > img[loading='lazy']). Без этого картинка резко
 * «впрыгивает» поверх уже проявившейся по data-reveal карточки.
 */

export function initPhotoFade(): void {
  const imgs = document.querySelectorAll<HTMLImageElement>(
    '.photo > picture > img[loading="lazy"]'
  );

  for (const img of imgs) {
    if (img.complete) {
      img.classList.add('is-loaded');
      continue;
    }
    img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
  }
}
