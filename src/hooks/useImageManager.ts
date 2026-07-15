import { useCallback, type Dispatch, type SetStateAction } from 'react';
import type { ImageKind, ScheduleState } from '../types';
import { DEFAULT_IMAGES } from '../utils/scheduleState';
import { readImageAsDataUrl } from '../utils/exporters';

type SetState = Dispatch<SetStateAction<ScheduleState>>;

export function useImageManager(setState: SetState) {
  const handleImageUpload = useCallback(
    (kind: ImageKind, file?: File) => {
      if (!file) return;

      readImageAsDataUrl(file)
        .then((dataUrl) => {
          setState((prev) => ({ ...prev, images: { ...prev.images, [kind]: dataUrl } }));
        })
        .catch((error) => {
          console.warn('Ошибка загрузки изображения', error);
        });
    },
    [setState],
  );

  const resetImage = useCallback((kind: ImageKind) => {
    setState((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [kind]: kind === 'hero' ? DEFAULT_IMAGES.hero : DEFAULT_IMAGES.mascot,
      },
    }));
  }, [setState]);

  return { handleImageUpload, resetImage };
}
