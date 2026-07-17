import { useCallback, useRef } from 'react';
import Toolbar from './components/Toolbar';
import Poster from './components/Poster';
import { useScheduleState } from './hooks/useScheduleState';

function App() {
  const posterRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {
    state,
    mondayDate,
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
    mobileEdit,
    toggleMobileEdit,
    resetMobileEdit,
    mobileAuto,
  } = useScheduleState();

  const onImportClick = useCallback(() => fileInputRef.current?.click(), []);
  const onSaveImage = useCallback(() => saveAsImage(posterRef.current), [saveAsImage]);

  return (
    <div className="app-shell">
      <Toolbar
        startDate={state.startDate}
        onStartDateChange={setStartDate}
        onExport={exportState}
        onImportClick={onImportClick}
        onReset={resetToDefault}
        onSaveImage={onSaveImage}
        onThemeColorChange={handleThemeColorChange}
        theme={state.theme}
        onImageUpload={handleImageUpload}
        onImageReset={resetImage}
        onThemeReset={resetTheme}
        isExporting={isExporting}
        view={view}
        onViewChange={setView}
        mobileEdit={mobileEdit}
        onToggleMobileEdit={toggleMobileEdit}
        mobileAuto={mobileAuto}
        onResetMobileEdit={resetMobileEdit}
      />
      <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileImport} hidden />

      <div className="poster-scroll">
        <Poster
          posterRef={posterRef}
          hero={state.hero}
          images={state.images}
          scheduleData={state.scheduleData}
          mondayDate={mondayDate}
          onHeroFieldChange={updateHeroField}
          onHeroTitleChange={updateHeroTitle}
          onDayNameChange={updateDayName}
          onOffTextChange={updateOffDayText}
          onGameFieldChange={updateGame}
          onRemoveGame={removeGame}
          onAddGame={addGame}
          onToggleOffDay={toggleOffDay}
          onToggleHighlightDay={toggleHighlightDay}
          onTwitchChange={setTwitch}
          twitch={state.twitch}
          view={view}
          mobileEdit={mobileEdit}
        />
      </div>
    </div>
  );
}

export default App;
