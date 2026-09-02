/** Общие данные сайта и навигации. */

export const site = {
  name: 'Голдфиш',
  legalName: 'ИП Фёдоров',
  tagline: 'Рыба холодного копчения',
  kicker: 'Холодное копчение',
  heroBadge: 'Опт • Доставка',
  /** TODO: согласовать с заказчиком финальный SEO-текст. */
  description:
    'Рыба холодного копчения «Голдфиш»: форель, кета, горбуша, скумбрия, сельдь. ' +
    'Собственное производство, поставки оптом.',
  url: 'https://xn----etbdepnacug3am8a9c.xn--p1ai',
} as const;

/**
 * Юридические реквизиты. Источник: https://www.rusprofile.ru/ip/322246800057141
 * (сверено на 2026-08-22). При смене реквизитов ИП — обновить и сверить заново.
 */
export const legal = {
  fullName: 'Индивидуальный предприниматель Фёдоров Анатолий Геннадьевич',
  ogrnip: '322246800057141',
  inn: '243502342847',
  registeredAt: '4 мая 2022 г.',
  address: 'Красноярский край, Сухобузимский район, дер. Ковригино',
} as const;

export interface NavItem {
  /** id секции на странице — он же якорь и ключ для scroll-spy. */
  id: string;
  label: string;
}

export const nav: NavItem[] = [
  { id: 'about', label: 'О бренде' },
  { id: 'products', label: 'Продукция' },
  { id: 'wholesale', label: 'Оптовым клиентам' },
  { id: 'contacts', label: 'Контакты' },
];

/** Ссылки в подвале: 3 колонки × 2 строки. */
export const footerNav: { label: string; href: string }[] = [
  { label: 'О бренде', href: '#about' },
  { label: 'Продукция', href: '#products' },
  { label: 'Контакты', href: '#contacts' },
  { label: 'Оптовым', href: '#wholesale' },
  // TODO: страница политики обработки персональных данных не спроектирована.
  { label: 'Политика', href: '#contacts' },
];

export interface ContactItem {
  label: string;
  /** null — значение ещё не получено от заказчика, рендерится как заглушка. */
  value: string | null;
  href: string | null;
  /** Что сюда подставить. Видно в заглушке и в CONTENT.md. */
  spec: string;
}

export const contacts: ContactItem[] = [
  { label: 'Телефон', value: '+7 (950) 418-01-76', href: 'tel:+79504180176', spec: 'номер для звонков' },
  { label: 'Telegram / WhatsApp / MAX', value: '+7 (950) 418-01-76', href: null, spec: 'мессенджеры для заявок' },
  {
    label: 'Email',
    value: 'tolik.fdorov.1979@mail.ru',
    href: 'mailto:tolik.fdorov.1979@mail.ru',
    spec: 'почта для заявок',
  },
  {
    label: 'Адрес',
    value: 'Красноярский край, Емельяновский муниципальный округ, посёлок Логовой, Трактовая улица, 6',
    href: null,
    spec: 'адрес производства',
  },
  { label: 'Режим работы', value: 'Круглосуточно, без выходных', href: null, spec: 'часы приёма заявок' },
];
