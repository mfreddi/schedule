export interface Game {
  name: string;
  time: string;
  tag: string;
  timeClass: string;
}

export interface ScheduleDay {
  day: string;
  highlight: boolean;
  off: boolean;
  offText?: string;
  games: Game[];
}

export interface Theme {
  accent: string;
  accent2: string;
  bg: string;
}

export interface Images {
  hero: string;
  mascot: string;
}

export interface HeroContent {
  eyebrow: string;
  titleLines: [string, string];
  subtitle: string;
}

export interface ScheduleState {
  theme: Theme;
  images: Images;
  startDate: string;
  scheduleData: ScheduleDay[];
  hero: HeroContent;
  twitch: string;
}

export type ImageKind = 'hero' | 'mascot';
export type ThemeKey = keyof Theme;
export type GameField = keyof Game;
