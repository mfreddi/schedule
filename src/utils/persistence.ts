import { normalizeState, STORAGE_KEY } from './scheduleState';
import type { ScheduleState } from '../types';

export function loadPersistedState(): ScheduleState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<ScheduleState>;
    return normalizeState(parsed);
  } catch (error) {
    console.warn('Ошибка загрузки состояния', error);
    return null;
  }
}

export function savePersistedState(state: ScheduleState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Ошибка сохранения состояния', error);
  }
}
