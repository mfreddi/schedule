import { useEffect } from 'react';
import type { Theme } from '../types';

export function useThemeVariables(theme: Theme): void {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--c-accent', theme.accent);
    root.style.setProperty('--c-accent2', theme.accent2);
    root.style.setProperty('--c-bg', theme.bg);

    const rgb =
      /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(theme.accent) || ['0', '255', '95', '109'];
    const accentRgb = `${parseInt(rgb[1], 16)},${parseInt(rgb[2], 16)},${parseInt(rgb[3], 16)}`;
    root.style.setProperty('--c-accent-glow-35', `rgba(${accentRgb},0.35)`);
    root.style.setProperty('--c-accent-glow-40', `rgba(${accentRgb},0.4)`);
  }, [theme]);
}
