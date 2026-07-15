import html2canvas from 'html2canvas';
import { normalizeState } from './scheduleState';
import type { ScheduleState } from '../types';

export function exportScheduleJson(state: ScheduleState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schedule_backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Файл не удалось прочитать как текст'));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('Ошибка чтения файла'));
    reader.readAsText(file);
  });
}

export function parseScheduleJson(text: string): ScheduleState {
  const parsed = JSON.parse(text) as Partial<ScheduleState>;
  return normalizeState(parsed);
}

export function handleFileImport(file: File): Promise<ScheduleState> {
  return readFileAsText(file).then(parseScheduleJson);
}

export function readImageAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('Файл не удалось прочитать как изображение'));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('Ошибка чтения изображения'));
    reader.readAsDataURL(file);
  });
}

export async function renderPosterToPng(posterElement: HTMLElement): Promise<string> {
  const canvas = await html2canvas(posterElement, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#120c1a',
  });
  return canvas.toDataURL('image/png');
}
