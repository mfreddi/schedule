import { memo, type RefObject } from 'react';
import type { HeroContent, ScheduleDay, Images, GameField } from '../types';

interface PosterProps {
  posterRef: RefObject<HTMLDivElement>;
  hero: HeroContent;
  images: Images;
  scheduleData: ScheduleDay[];
  mondayDate: Date;
  onHeroFieldChange: (field: 'eyebrow' | 'subtitle', value: string) => void;
  onHeroTitleChange: (index: 0 | 1, value: string) => void;
  onDayNameChange: (index: number, value: string) => void;
  onOffTextChange: (dayIdx: number, value: string) => void;
  onGameFieldChange: (dayIdx: number, gameIdx: number, field: GameField, value: string) => void;
  onRemoveGame: (dayIdx: number, gameIdx: number) => void;
  onAddGame: (dayIdx: number) => void;
  onToggleOffDay: (dayIdx: number) => void;
  onToggleHighlightDay: (dayIdx: number) => void;
  onTwitchChange: (value: string) => void;
  twitch: string;
}

const formatDate = (d: Date): string => {
  const day = d.getDate();
  const monthNames = [
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
  return `${day} ${monthNames[d.getMonth()]}`;
};

const Poster = memo(
  ({
    posterRef,
    hero,
    images,
    scheduleData,
    mondayDate,
    onHeroFieldChange,
    onHeroTitleChange,
    onDayNameChange,
    onOffTextChange,
    onGameFieldChange,
    onRemoveGame,
    onAddGame,
    onToggleOffDay,
    onToggleHighlightDay,
    onTwitchChange,
    twitch,
  }: PosterProps) => {
    return (
      <div className={`poster`} ref={posterRef}>
        <div className="hero">
          <div className="hero-bg" style={{ backgroundImage: `url('${images.hero}')` }} />
          <div className="hero-content">
            <div
              className="eyebrow"
              contentEditable
              suppressContentEditableWarning
              onBlur={(event) =>
                onHeroFieldChange('eyebrow', event.currentTarget.textContent || '')
              }
            >
              {hero.eyebrow}
            </div>
            <div className="title">
              <div
                className="title-line"
                contentEditable
                suppressContentEditableWarning
                onBlur={(event) => onHeroTitleChange(0, event.currentTarget.textContent || '')}
              >
                {hero.titleLines[0]}
              </div>
              <div
                className="title-line"
                contentEditable
                suppressContentEditableWarning
                onBlur={(event) => onHeroTitleChange(1, event.currentTarget.textContent || '')}
              >
                {hero.titleLines[1]}
              </div>
            </div>
            <div
              className="subtitle"
              contentEditable
              suppressContentEditableWarning
              onBlur={(event) =>
                onHeroFieldChange('subtitle', event.currentTarget.textContent || '')
              }
            >
              {hero.subtitle}
            </div>
          </div>
          <div className="mascot-badge">
            <img src={images.mascot} alt="Mascot" />
          </div>
        </div>

        <div className="schedule">
          {scheduleData.map((dayData, index) => {
            const d = new Date(mondayDate);
            d.setDate(d.getDate() + index);
            return (
              <div
                key={`${dayData.day}-${index}`}
                className={`row${dayData.highlight ? ' highlight' : ''}${dayData.off ? ' off' : ''}`}
              >
                <div>
                  <div
                    className="day"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(event) =>
                      onDayNameChange(index, event.currentTarget.textContent || '')
                    }
                  >
                    {dayData.day}
                  </div>
                  <div className="date">{formatDate(d)}</div>
                </div>

                <div className="games-list">
                  {dayData.off ? (
                    <div
                      className="off-placeholder"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(event) =>
                        onOffTextChange(index, event.currentTarget.textContent || '')
                      }
                    >
                      {dayData.offText || 'Выходной'}
                    </div>
                  ) : null}
                  {dayData.games.map((game, gameIdx) => (
                    <div key={`${dayData.day}-${gameIdx}`} className="game-item">
                      <div className="game-info">
                        <div
                          className="game"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(event) =>
                            onGameFieldChange(
                              index,
                              gameIdx,
                              'name',
                              event.currentTarget.textContent || '',
                            )
                          }
                        >
                          {game.name}
                        </div>
                        <div
                          className="tag"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(event) =>
                            onGameFieldChange(
                              index,
                              gameIdx,
                              'tag',
                              event.currentTarget.textContent || '',
                            )
                          }
                        >
                          {game.tag || ''}
                        </div>
                      </div>
                      <div className="time-container">
                        <div
                          className={dayData.highlight ? 'time' : game.timeClass || 'time alt'}
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(event) =>
                            onGameFieldChange(
                              index,
                              gameIdx,
                              'time',
                              event.currentTarget.textContent || '',
                            )
                          }
                        >
                          {game.time}
                        </div>
                        <button
                          data-html2canvas-ignore
                          className="remove-btn"
                          onClick={() => onRemoveGame(index, gameIdx)}
                          title="Удалить стрим"
                        >
                          ✖
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="game-actions" data-html2canvas-ignore>
                    <button className="add-btn" onClick={() => onAddGame(index)}>
                      + Добавить стрим
                    </button>
                  </div>
                </div>

                <div className="right-controls" data-html2canvas-ignore>
                  <button
                    className="day-toggle"
                    onClick={() => onToggleOffDay(index)}
                    title="Выходной"
                  >
                    Off
                  </button>
                  <button
                    className="highlight-toggle"
                    onClick={() => onToggleHighlightDay(index)}
                    title="Выделить день"
                  >
                    ★
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="footer">
          <div className="footer-line" />
          <a
            className="twitch-link"
            href="https://twitch.tv/mFred"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 2L2.5 5.5V19h5V22h3l3-3h4.5L22 14.5V2H4Z" fill="#9146FF" />
              <rect x="14" y="6" width="1.7" height="6" fill="#fff" />
              <rect x="10" y="6" width="1.7" height="6" fill="#fff" />
            </svg>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(event) => onTwitchChange(event.currentTarget.textContent || '')}
            >
              {twitch}
            </span>
          </a>
          <div className="footer-line" />
        </div>
        <footer>
          <p className="text-center text-muted">
            created by{' '}
            <a href="https://t.me/NikolayFred" target="_blank">
              @NikolayFred
            </a>
            .
          </p>
        </footer>
      </div>
    );
  },
);

export default Poster;
