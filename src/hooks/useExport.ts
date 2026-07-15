import { useCallback, useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react';
import type { ScheduleState } from '../types';
import {
  exportScheduleJson,
  handleFileImport,
  renderPosterToPng,
} from '../utils/exporters';

type SetState = Dispatch<SetStateAction<ScheduleState>>;

export function useExport(state: ScheduleState, setState: SetState) {
  const [isExporting, setIsExporting] = useState(false);

  const exportState = useCallback(() => {
    exportScheduleJson(state);
  }, [state]);

  const importFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const clearInput = () => {
        event.target.value = '';
      };
      const file = event.target.files?.[0];
      if (!file) {
        clearInput();
        return;
      }

      handleFileImport(file)
        .then((parsed) => {
          if (
            window.confirm('Импортировать данные из файла? Текущие изменения будут потеряны.')
          ) {
            setState(parsed);
            alert('Импорт выполнен успешно!');
          }
        })
        .catch((error) => {
          alert(`Ошибка при чтении файла: ${(error as Error).message}`);
        })
        .finally(clearInput);
    },
    [setState],
  );

  const saveAsImage = useCallback(async (posterElement: HTMLElement | null) => {
    if (!posterElement) return;

    setIsExporting(true);
    try {
      const dataUrl = await renderPosterToPng(posterElement);
      const link = document.createElement('a');
      link.download = 'schedule.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(error);
      alert('Ошибка при создании изображения');
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportState, handleFileImport: importFile, saveAsImage, isExporting };
}
