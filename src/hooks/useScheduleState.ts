import { useCallback, useMemo, useState, type ChangeEvent } from 'react';
import type { GameField, ImageKind, ScheduleDay, ScheduleState, ThemeKey } from '../types';
import {
  createDefaultState,
  DEFAULT_THEME,
  DEFAULT_IMAGES,
  getMonday,
} from '../utils/scheduleState';
import { usePersistence } from './usePersistence';
import { useExport } from './useExport';
import { useImageManager } from './useImageManager';
import { useThemeVariables } from './useThemeVariables';

export interface UseScheduleStateResult {
  state: ScheduleState;
  mondayDate: Date;
  updatePartial: (partial: Partial<ScheduleState>) => void;
  setStartDate: (value: string) => void;
  setTwitch: (value: string) => void;
  updateHeroField: (field: 'eyebrow' | 'subtitle', value: string) => void;
  updateHeroTitle: (index: 0 | 1, value: string) => void;
  updateDayName: (index: number, value: string) => void;
  updateOffDayText: (dayIdx: number, value: string) => void;
  updateGame: (dayIdx: number, gameIdx: number, field: GameField, value: string) => void;
  addGame: (dayIdx: number) => void;
  removeGame: (dayIdx: number, gameIdx: number) => void;
  toggleOffDay: (dayIdx: number) => void;
  toggleHighlightDay: (dayIdx: number) => void;
  resetToDefault: () => void;
  exportState: () => void;
  handleFileImport: (event: ChangeEvent<HTMLInputElement>) => void;
  handleThemeColorChange: (key: ThemeKey, value: string) => void;
  handleImageUpload: (kind: ImageKind, file?: File) => void;
  resetImage: (kind: ImageKind) => void;
  resetTheme: () => void;
  saveAsImage: (posterElement: HTMLElement | null) => Promise<void>;
  isExporting: boolean;
  view: 'vertical' | 'horizontal';
  setView: (view: 'vertical' | 'horizontal') => void;
}

export function useScheduleState(): UseScheduleStateResult {
  const [state, setState] = useState<ScheduleState>(() => createDefaultState());

  usePersistence(state, setState);
  useThemeVariables(state.theme);

  const { exportState, handleFileImport, saveAsImage, isExporting } = useExport(state, setState);
  const { handleImageUpload, resetImage } = useImageManager(setState);

  const mondayDate = useMemo(() => {
    const monday = new Date(`${state.startDate}T00:00:00`);
    return Number.isNaN(monday.getTime()) ? getMonday(new Date()) : getMonday(monday);
  }, [state.startDate]);

  const updatePartial = useCallback((partial: Partial<ScheduleState>): void => {
    setState((prev: ScheduleState) => ({ ...prev, ...partial }));
  }, []);

  const [view, setView] = useState<'vertical' | 'horizontal'>('vertical');

  const setStartDate = useCallback(
    (value: string): void => updatePartial({ startDate: value }),
    [updatePartial],
  );

  const setTwitch = useCallback(
    (value: string): void => updatePartial({ twitch: value }),
    [updatePartial],
  );

  const updateHeroField = useCallback((field: 'eyebrow' | 'subtitle', value: string): void => {
    setState((prev: ScheduleState) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  }, []);

  const updateHeroTitle = useCallback((index: 0 | 1, value: string): void => {
    setState((prev: ScheduleState) => {
      const nextLines = [...prev.hero.titleLines] as [string, string];
      nextLines[index] = value;
      return {
        ...prev,
        hero: { ...prev.hero, titleLines: nextLines },
      };
    });
  }, []);

  const updateDayName = useCallback((index: number, value: string): void => {
    setState((prev: ScheduleState) => ({
      ...prev,
      scheduleData: prev.scheduleData.map((day: ScheduleDay, dayIdx: number) =>
        dayIdx === index ? { ...day, day: value } : day,
      ),
    }));
  }, []);

  const updateOffDayText = useCallback((dayIdx: number, value: string): void => {
    setState((prev: ScheduleState) => ({
      ...prev,
      scheduleData: prev.scheduleData.map((day: ScheduleDay, idx: number) =>
        idx === dayIdx ? { ...day, offText: value } : day,
      ),
    }));
  }, []);

  const updateGame = useCallback(
    (dayIdx: number, gameIdx: number, field: GameField, value: string): void => {
      setState((prev: ScheduleState) => ({
        ...prev,
        scheduleData: prev.scheduleData.map((day: ScheduleDay, idx: number) =>
          idx === dayIdx
            ? {
                ...day,
                games: day.games.map((game, gIdx: number) =>
                  gIdx === gameIdx ? { ...game, [field]: value } : game,
                ),
              }
            : day,
        ),
      }));
    },
    [],
  );

  const addGame = useCallback((dayIdx: number): void => {
    setState((prev: ScheduleState) => ({
      ...prev,
      scheduleData: prev.scheduleData.map((day: ScheduleDay, idx: number) => {
        if (idx !== dayIdx) return day;
        const nextDay: ScheduleDay = { ...day };
        if (nextDay.off) nextDay.off = false;
        nextDay.games = [
          ...nextDay.games,
          { name: 'Новый стрим', time: '12:00', tag: '', timeClass: 'time alt' },
        ];
        return nextDay;
      }),
    }));
  }, []);

  const removeGame = useCallback((dayIdx: number, gameIdx: number): void => {
    setState((prev: ScheduleState) => {
      const day = prev.scheduleData[dayIdx];
      if (!day) return prev;
      if (day.games.length <= 1) {
        alert('Нельзя удалить последний стрим. Сделайте день выходным, если нужно.');
        return prev;
      }
      return {
        ...prev,
        scheduleData: prev.scheduleData.map((item: ScheduleDay, idx: number) =>
          idx === dayIdx
            ? { ...item, games: item.games.filter((_: unknown, gIdx: number) => gIdx !== gameIdx) }
            : item,
        ),
      };
    });
  }, []);

  const toggleOffDay = useCallback((dayIdx: number): void => {
    setState((prev: ScheduleState) => ({
      ...prev,
      scheduleData: prev.scheduleData.map((day: ScheduleDay, idx: number) =>
        idx === dayIdx ? { ...day, off: !day.off } : day,
      ),
    }));
  }, []);

  const toggleHighlightDay = useCallback((dayIdx: number): void => {
    setState((prev: ScheduleState) => ({
      ...prev,
      scheduleData: prev.scheduleData.map((day: ScheduleDay, idx: number) =>
        idx === dayIdx ? { ...day, highlight: !day.highlight } : day,
      ),
    }));
  }, []);

  const resetToDefault = useCallback((): void => {
    if (window.confirm('Сбросить все изменения к исходному состоянию?')) {
      setState(createDefaultState());
    }
  }, []);

  const handleThemeColorChange = useCallback((key: ThemeKey, value: string): void => {
    setState((prev: ScheduleState) => ({ ...prev, theme: { ...prev.theme, [key]: value } }));
  }, []);

  const resetTheme = useCallback((): void => {
    setState((prev: ScheduleState) => ({
      ...prev,
      theme: { ...DEFAULT_THEME },
      images: { hero: DEFAULT_IMAGES.hero, mascot: DEFAULT_IMAGES.mascot },
    }));
  }, []);

  return {
    state,
    mondayDate,
    updatePartial,
    setStartDate,
    setTwitch,
    updateHeroField,
    updateHeroTitle,
    updateDayName,
    updateOffDayText,
    updateGame,
    addGame,
    removeGame,
    toggleOffDay,
    toggleHighlightDay,
    resetToDefault,
    exportState,
    handleFileImport,
    handleThemeColorChange,
    handleImageUpload,
    resetImage,
    resetTheme,
    saveAsImage,
    isExporting,
    view,
    setView,
  };
}
