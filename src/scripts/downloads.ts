/**
 * Кнопки скачивания прайса: иконка download меняется на галочку после
 * клика — короткая подсказка «файл пошёл на скачивание», без всплывающих
 * окон. Возвращается обратно через паузу, чтобы кнопкой можно было
 * воспользоваться повторно.
 */

const RESET_DELAY_MS = 2500;

export function initDownloadButtons(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>('[data-download-btn]');
  const timers = new WeakMap<HTMLAnchorElement, number>();

  for (const link of links) {
    link.addEventListener('click', () => {
      link.classList.add('is-downloaded');

      const previous = timers.get(link);
      if (previous) window.clearTimeout(previous);

      const next = window.setTimeout(() => link.classList.remove('is-downloaded'), RESET_DELAY_MS);
      timers.set(link, next);
    });
  }
}
