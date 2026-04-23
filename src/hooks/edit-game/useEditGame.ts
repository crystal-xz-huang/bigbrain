'use client';

import { useContext } from 'react';
import EditGameContext from "@/hooks/edit-game/context";

const useEditGame = () => {
  const ctx = useContext(EditGameContext);
  if (!ctx) throw new Error('useEditGame must be inside EditGameProvider');
  return ctx;
}

export default useEditGame;