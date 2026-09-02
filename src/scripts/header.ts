/**
 * Sticky-шапка: сжатие при скролле, scroll-spy по секциям, плавный переход
 * к якорям с учётом высоты шапки и мобильное меню.
 *
 * Состояния (локальные, стор не нужен):
 *   isHeaderCompact, activeSection, isMobileMenuOpen.
 */

import { cssVarPx, onScrollFrame, prefersReducedMotion } from './utils';

const COMPACT_AFTER = 80;

export function initHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  const navLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')
  );

  const sectionIds = [...new Set(navLinks.map((link) => link.dataset.navLink!))];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  let isCompact = false;
  let activeSection = '';

  /* --- Сжатие шапки и scroll-spy ---------------------------------------- */

  const syncOnScroll = () => {
    const y = window.scrollY;

    const nextCompact = y > COMPACT_AFTER;
    if (nextCompact !== isCompact) {
      isCompact = nextCompact;
      header.dataset.compact = String(isCompact);
    }

    // Активной считаем последнюю секцию, чей верх ушёл выше нижней кромки шапки.
    const line = y + header.offsetHeight + 8;
    let next = '';
    for (const section of sections) {
      if (section.offsetTop <= line) next = section.id;
    }

    // У конца страницы подсвечиваем последнюю секцию: до её верха скролла
    // может не хватить.
    const atBottom =
      window.innerHeight + y >= document.documentElement.scrollHeight - 2;
    if (atBottom && sections.length > 0) next = sections[sections.length - 1]!.id;

    if (next === activeSection) return;
    activeSection = next;

    for (const link of navLinks) {
      const isActive = link.dataset.navLink === activeSection;
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  onScrollFrame(syncOnScroll);

  /* --- Плавный переход к якорям ------------------------------------------ */

  const scrollToSection = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      return;
    }

    const target = document.getElementById(id);
    if (!target) return;

    // Offset считаем вручную: scrollIntoView не умеет учитывать sticky-шапку.
    //
    // Дополнительная тонкость: sticky-шапка остаётся в потоке, поэтому её
    // сжатие 88 → 64 утягивает весь контент вверх на разницу высот. Если
    // стартуем с развёрнутой шапкой, а приземляемся со сжатой, эту разницу
    // нужно вычесть — иначе секция уезжает под шапку.
    const expanded = cssVarPx('--header-h', 88);
    const compact = cssVarPx('--header-h-compact', 64);
    const delta = expanded - compact;
    const startsCompact = window.scrollY > COMPACT_AFTER;
    const documentTop = window.scrollY + target.getBoundingClientRect().top;

    let top = documentTop - compact + 1 - (startsCompact ? 0 : delta);

    if (top <= COMPACT_AFTER) {
      // Приземляемся выше порога сжатия — шапка останется развёрнутой.
      top = documentTop - expanded + 1 + (startsCompact ? delta : 0);
    }

    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
      'a[href^="#"]'
    );
    if (!link) return;

    const id = link.getAttribute('href')!.slice(1);
    if (!id) return;
    if (!document.getElementById(id) && id !== 'top') return;

    event.preventDefault();
    closeMenu();
    scrollToSection(id);
    history.replaceState(null, '', id === 'top' ? location.pathname : `#${id}`);
  });

  /* --- Мобильное меню ----------------------------------------------------- */

  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const closeBtn = document.querySelector<HTMLButtonElement>('[data-menu-close]');

  let isMenuOpen = false;

  function openMenu(): void {
    if (!menu || !toggle || isMenuOpen) return;
    isMenuOpen = true;
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    closeBtn?.focus();
  }

  function closeMenu(): void {
    if (!menu || !toggle || !isMenuOpen) return;
    isMenuOpen = false;
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    toggle.focus();
  }

  toggle?.addEventListener('click', () => (isMenuOpen ? closeMenu() : openMenu()));
  closeBtn?.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isMenuOpen) closeMenu();
  });

  // Возврат на десктоп при открытом меню не должен оставлять body заблокированным.
  window.matchMedia('(min-width: 1025px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
}
