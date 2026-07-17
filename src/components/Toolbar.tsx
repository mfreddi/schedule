import { memo, type ChangeEvent } from 'react';
import type { ImageKind, Theme, ThemeKey } from '../types';

interface ToolbarProps {
  startDate: string;
  onStartDateChange: (value: string) => void;
  onExport: () => void;
  onImportClick: () => void;
  onReset: () => void;
  onSaveImage: () => void;
  onThemeColorChange: (key: ThemeKey, value: string) => void;
  theme: Theme;
  onImageUpload: (kind: ImageKind, file?: File) => void;
  onImageReset: (kind: ImageKind) => void;
  onThemeReset: () => void;
  isExporting: boolean;
  view: 'vertical' | 'horizontal';
  onViewChange: (view: 'vertical' | 'horizontal') => void;
  mobileEdit: boolean;
  onToggleMobileEdit: () => void;
  mobileAuto: boolean;
  onResetMobileEdit: () => void;
}

const Toolbar = memo(
  ({
    startDate,
    onStartDateChange,
    onExport,
    onImportClick,
    onReset,
    onSaveImage,
    onThemeColorChange,
    theme,
    onImageUpload,
    onImageReset,
    onThemeReset,
    isExporting,
    view,
    onViewChange,
    mobileEdit,
    onToggleMobileEdit,
    mobileAuto,
    onResetMobileEdit,
  }: ToolbarProps) => {
    const handleImageChange =
      (kind: ImageKind) =>
      (event: ChangeEvent<HTMLInputElement>): void => {
        onImageUpload(kind, event.target.files?.[0]);
      };

    return (
      <>
        <div className="save-bar">
          <label>
            Начало (ПН):
            <input
              type="date"
              value={startDate}
              onChange={(event) => onStartDateChange(event.target.value)}
            />
          </label>
          <div className="btn-group">
            <div className="view-switch" role="group" aria-label="Вид расписания">
              <button
                type="button"
                className={`view-btn${view === 'vertical' ? ' active' : ''}`}
                onClick={() => onViewChange('vertical')}
                title="Вертикальный вид (для мобилок)"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              <button
                type="button"
                className={`view-btn${view === 'horizontal' ? ' active' : ''}`}
                onClick={() => onViewChange('horizontal')}
                title="Горизонтальный вид (неделя в ряд)"
                disabled={mobileEdit}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              {mobileEdit && (
                <button
                  type="button"
                  className={`view-btn${mobileEdit ? ' active' : ''}`}
                  onClick={mobileAuto ? onToggleMobileEdit : onResetMobileEdit}
                  title={
                    mobileAuto
                      ? 'Мобильное редактирование (авто). Нажмите для отключения'
                      : 'Мобильное редактирование вручную. Нажмите для возврата в авто-режим'
                  }
                >
                  📱
                </button>
              )}
            </div>
            <button className="btn btn-export" onClick={onExport}>
              📥 Экспорт
            </button>
            <button className="btn btn-success" onClick={onImportClick}>
              📤 Импорт
            </button>
            <button className="btn btn-secondary" onClick={onReset}>
              Сбросить всё
            </button>
            <button className="btn btn-primary" onClick={onSaveImage} disabled={isExporting}>
              {isExporting ? 'Готовим картинку…' : 'Скачать картинкой'}
            </button>
          </div>
        </div>

        <div className="theme-bar">
          <div className="theme-group">
            <span>Акцент 1</span>
            <input
              type="color"
              value={theme.accent}
              onChange={(event) => onThemeColorChange('accent', event.target.value)}
            />
          </div>
          <div className="theme-group">
            <span>Акцент 2</span>
            <input
              type="color"
              value={theme.accent2}
              onChange={(event) => onThemeColorChange('accent2', event.target.value)}
            />
          </div>
          <div className="theme-group">
            <span>Фон</span>
            <input
              type="color"
              value={theme.bg}
              onChange={(event) => onThemeColorChange('bg', event.target.value)}
            />
          </div>
          <div className="theme-group">
            <label className="btn-file" htmlFor="bgImageInput">
              🖼 Фон обложки
            </label>
            <input
              id="bgImageInput"
              hidden
              type="file"
              accept="image/*"
              onChange={handleImageChange('hero')}
            />
            <button className="btn-reset-mini" onClick={() => onImageReset('hero')}>
              сброс
            </button>
          </div>
          <div className="theme-group">
            <label className="btn-file" htmlFor="mascotImageInput">
              🐾 Маскот
            </label>
            <input
              id="mascotImageInput"
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange('mascot')}
            />
            <button className="btn-reset-mini" onClick={() => onImageReset('mascot')}>
              сброс
            </button>
          </div>
          <div className="theme-group">
            <button className="btn-reset-mini" onClick={onThemeReset}>
              сбросить оформление
            </button>
          </div>
        </div>
      </>
    );
  },
);

export default Toolbar;
