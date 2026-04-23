import type {
  GameEditDTO,
  QuestionDTO,
  UpdateGameActionResponse
} from '@/lib/definitions/types';
import { Category, GameVisibility } from '@prisma/client';
import { createContext } from 'react';

type EditGameContext = {
  state: UpdateGameActionResponse;
  action: (payload: FormData) => void;
  pending: boolean;
  game: GameEditDTO;
  setGame: (game: GameEditDTO) => void;
  setQuestion: (question: QuestionDTO) => void;
  onAddQuestion: (newQuestion: QuestionDTO) => void;
  onDeleteQuestion: (questionId: string) => void;
  onAddAnswer: (questionId: string, correct?: boolean) => void;
  categories: Category[];
  tagsList: string[];
  setTagsList: (tags: string[]) => void;
  toggleCategory: (category: Category) => void;
  setGameVisibility: (visibility: GameVisibility) => void;
};

const EditGameContext = createContext<EditGameContext | null>(null);

export default EditGameContext;
