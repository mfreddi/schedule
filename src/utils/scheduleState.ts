import type { HeroContent, Images, ScheduleDay, ScheduleState, Theme } from '../types';

export const STORAGE_KEY = 'schedule_state_v5';

export const DEFAULT_THEME: Theme = {
  accent: '#ff5f6d',
  accent2: '#08d9d6',
  bg: '#120c1a',
};

export const DEFAULT_IMAGES: Images = {
  hero: `${import.meta.env.BASE_URL}intro.jpg`,
  mascot: `${import.meta.env.BASE_URL}tomato.png`,
};

export const DEFAULT_DATA: ScheduleDay[] = [
  {
    day: 'ПН',
    highlight: false,
    off: false,
    offText: 'Выходной',
    games: [{ name: 'Delta Force', time: '~19:00', tag: 'Открытие недели', timeClass: 'time alt' }],
  },
  {
    day: 'ВТ',
    highlight: false,
    off: false,
    offText: 'Выходной',
    games: [{ name: 'Hunt: Showdown', time: '19:00', tag: '', timeClass: 'time alt' }],
  },
  {
    day: 'СР',
    highlight: false,
    off: false,
    offText: 'Выходной',
    games: [{ name: 'Hunt: Showdown', time: '19:00', tag: '', timeClass: 'time alt' }],
  },
  {
    day: 'ЧТ',
    highlight: false,
    off: false,
    offText: 'Выходной',
    games: [{ name: 'Need for Speed: Most Wanted', time: '19:00', tag: '', timeClass: 'time alt' }],
  },
  {
    day: 'ПТ',
    highlight: false,
    off: false,
    offText: 'Выходной',
    games: [{ name: 'Dead by Daylight', time: '20:00', tag: '', timeClass: 'time alt' }],
  },
  {
    day: 'СБ',
    highlight: false,
    off: false,
    offText: 'Выходной',
    games: [
      {
        name: 'Ретро-вечер',
        time: '~10:00',
        tag: 'играю с желающими из чата',
        timeClass: 'time alt',
      },
    ],
  },
  {
    day: 'ВС',
    highlight: false,
    off: false,
    offText: 'Выходной',
    games: [
      {
        name: 'Чилл / вопрос-ответ',
        time: '~10:00',
        tag: 'играю с желающими из чата',
        timeClass: 'time alt',
      },
    ],
  },
];

export function cloneData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

const MONTH_NAMES_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

const MONTH_NAMES_UPPER = MONTH_NAMES_GENITIVE.map((m) => m.toUpperCase());

export function formatDateRangeTitle(startDate: string): [string, string] {
  const monday = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(monday.getTime())) return ['', ''];
  const start = getMonday(monday);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const startDay = start.getDate();
  const endDay = end.getDate();

  if (start.getMonth() === end.getMonth()) {
    return [`${startDay}—${endDay}`, MONTH_NAMES_UPPER[start.getMonth()]];
  }
  return [
    `${startDay} ${MONTH_NAMES_GENITIVE[start.getMonth()]} — ${endDay} ${MONTH_NAMES_GENITIVE[end.getMonth()]}`,
    '',
  ];
}

export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createDefaultState(): ScheduleState {
  const monday = getMonday(new Date());
  return {
    theme: { ...DEFAULT_THEME },
    images: { ...DEFAULT_IMAGES },
    startDate: formatDateInput(monday),
    scheduleData: cloneData(DEFAULT_DATA),
    hero: {
      eyebrow: 'Неделя стримов',
      titleLines: formatDateRangeTitle(formatDateInput(monday)),
      subtitle: 'Расписание на эту неделю',
    },
    twitch: 'twitch.tv/mFred',
  };
}

export function normalizeState(raw: Partial<ScheduleState> | null | undefined): ScheduleState {
  const base = createDefaultState();
  if (!raw) return base;

  const scheduleData =
    Array.isArray(raw.scheduleData) && raw.scheduleData.length
      ? raw.scheduleData.map((day) => ({
          day: day.day || '',
          highlight: Boolean(day.highlight),
          off: Boolean(day.off),
          offText: day.offText ?? 'Выходной',
          games: Array.isArray(day.games)
            ? day.games.map((game) => ({
                name: game.name || '',
                time: game.time || '',
                tag: game.tag || '',
                timeClass: game.timeClass || 'time alt',
              }))
            : [],
        }))
      : cloneData(DEFAULT_DATA);

  const hero: HeroContent = {
    eyebrow: raw.hero?.eyebrow || base.hero.eyebrow,
    titleLines:
      Array.isArray(raw.hero?.titleLines) && raw.hero.titleLines.length
        ? raw.hero.titleLines
        : [
            raw.hero?.titleLines?.[0] || base.hero.titleLines[0],
            raw.hero?.titleLines?.[1] || base.hero.titleLines[1],
          ],
    subtitle: raw.hero?.subtitle || base.hero.subtitle,
  };

  return {
    theme: { ...base.theme, ...(raw.theme || {}) },
    images: { ...base.images, ...(raw.images || {}) },
    startDate: raw.startDate || base.startDate,
    scheduleData,
    hero,
    twitch: raw.twitch || base.twitch,
  };
}
