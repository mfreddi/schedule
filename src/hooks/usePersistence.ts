import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { ScheduleState } from '../types';
import { loadPersistedState, savePersistedState } from '../utils/persistence';

type SetState = Dispatch<SetStateAction<ScheduleState>>;

export function usePersistence(state: ScheduleState, setState: SetState): boolean {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadPersistedState();
    if (loaded) {
      setState(loaded);
    }
    setHasHydrated(true);
  }, [setState]);

  useEffect(() => {
    if (!hasHydrated) return;
    savePersistedState(state);
  }, [state, hasHydrated]);

  return hasHydrated;
}
