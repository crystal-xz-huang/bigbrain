/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import UpdateUsername from '@/components/modals/update-username';
import { useToast } from '@/hooks/toast';
import { updateGameAction } from '@/lib/actions/game';
import { updateUsernameAction } from '@/lib/actions/username';
import type {
  GameEditDTO,
  QuestionDTO,
  UpdateGameActionResponse,
  UpdateUsernameActionResponse,
  UserDTO,
} from '@/lib/definitions/types';
import { dedupe, generateAnswersForQuestionType, newAnswer, normalize } from '@/lib/utils';
import { Category, GameVisibility } from '@prisma/client';
import React, {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import EditGameContext from './context';
import * as z from 'zod';
import { Username } from '@/lib/zod';

const EditGameProvider = ({
  game: data,
  categories,
  user,
  children,
}: {
  game: GameEditDTO;
  categories: Category[];
  user: UserDTO;
  children: React.ReactNode;
}) => {
  // ----- Hooks -----
  const toast = useToast();

  // ----- State -----
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [game, setGame] = useState<GameEditDTO>(data);
  const initialState: UpdateGameActionResponse = {
    success: false,
    message: '',
    game: data,
  };
  const initialUsernameState: UpdateUsernameActionResponse = {
    success: false,
    message: '',
  };

  // ----- Action State -----
  const [state, action, pending] = useActionState(
    updateGameAction.bind(null, user.id),
    initialState
  );
  const [usernameState, usernameAction, usernamePending] = useActionState(
    updateUsernameAction.bind(null, user.id),
    initialUsernameState
  )

  // ----- Effects -----
  useEffect(() => {
    if (state.success && state.message && state.game) {
      toast.success(state.message);
      setGame(state.game);
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state.game, state.success, state.message]);

  useEffect(() => {
    if (usernameState.success && usernameState.message && usernameState.username) {
      setShowUsernameModal(false);
      setGame((prev) => ({ ...prev, visibility: GameVisibility.PUBLIC }));
      toast.success(usernameState.message);
    }
  }, [usernameState.success, usernameState.message, usernameState.username]);

  // ----- State Setters -----
  const setQuestion = useCallback((updated: QuestionDTO) => {
    setGame((prev) => {
      // Find the previous version of the question
      const previous = prev.questions.find((q) => q.id === updated.id);
      if (!previous) return prev;

      // If the question type has changed, regenerate answers accordingly
      const next: QuestionDTO =
        previous.type !== updated.type
          ? {
              ...updated,
              answers: generateAnswersForQuestionType(previous, updated.type),
            }
          : updated;

      return {
        ...prev,
        questions: prev.questions.map((q) => (q.id === updated.id ? next : q)),
      };
    });
  }, []);

  const onAddQuestion = useCallback((q: QuestionDTO) => {
    setGame((prev) => ({ ...prev, questions: [...prev.questions, q] }));
  }, []);

  const onDeleteQuestion = useCallback((id: string) => {
    setGame((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  }, []);

  const onAddAnswer = useCallback((qid: string, correct = true) => {
    setGame((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id !== qid ? q : { ...q, answers: [...q.answers, newAnswer(correct)] }
      ),
    }));
  }, []);

  // ----- Category mappers -----
  // category id <-> name maps
  const categoryIdToName = useMemo(
    () => new Map(categories.map((c) => [c.id, normalize(c.name)])),
    [categories]
  );

  // category name <-> id maps
  const categoryNameToId = useMemo(
    () => new Map(categories.map((c) => [normalize(c.name), c.id])),
    [categories]
  );

  // combined list of strings representing categories + tags
  const tagsList = useMemo(() => {
    // (1) map category ids to names
    const categories = game.categories
      .map((id) => categoryIdToName.get(id))
      .filter(Boolean) as string[];
    // (2) normalize tags
    const tags = game.tags.map(normalize);
    // (3) return the deduped combination
    return dedupe([...categories, ...tags]);
  }, [game.categories, game.tags, categoryIdToName]);

  // set tags from the list of strings representing categories + tags
  const setTagsList = useCallback((list: string[]) => {
    const cleaned = dedupe(list.map(normalize));

    const nextCategoryIds: number[] = [];
    const nextTags: string[] = [];

    for (const name of cleaned) {
      const id = categoryNameToId.get(name);
      if (id) {
        if (!nextCategoryIds.includes(id)) nextCategoryIds.push(id);
      } else {
        if (!nextTags.includes(name)) nextTags.push(name);
      }
    }

    // ensure max 2 categories (drop extras)
    if (nextCategoryIds.length > 2) nextCategoryIds.splice(2);

    setGame((prev) => ({
      ...prev,
      categories: nextCategoryIds,
      tags: nextTags,
    }))
  }, [categoryNameToId]);

  // Add/remove the category tag in the list of tags+categories
  const toggleCategory = useCallback((category: Category) => {
    const name = categoryIdToName.get(category.id)!;
    const set = new Set(tagsList);
    if (set.has(name)) {
      set.delete(name);
    } else {
      if (game.categories.length >= 2) return; // max 2 categories
      set.add(name);
    }
    setTagsList(Array.from(set));
  }, [categoryIdToName, setTagsList, tagsList])

  // ----- Game Visbility -----
  const setGameVisibility = useCallback((visibility: GameVisibility) => {
    if (visibility === GameVisibility.PUBLIC) {
      // check if it is a cuid generated username
      const isDefaultUsername = z.cuid().safeParse(user.username).success;
      if (isDefaultUsername) {
        setShowUsernameModal(true);
        return;
      }
    }
    setGame((prev) => ({ ...prev, visibility }));
  }, [user]);

  const value = useMemo(
    () => ({
      state,
      action,
      pending,
      game,
      categories,
      setGame,
      setGameVisibility,
      setQuestion,
      onAddQuestion,
      onDeleteQuestion,
      onAddAnswer,
      tagsList,
      setTagsList,
      toggleCategory,
    }),
    [
      state,
      action,
      pending,
      game,
      categories,
      setGame,
      setGameVisibility,
      setQuestion,
      onAddQuestion,
      onDeleteQuestion,
      onAddAnswer,
      tagsList,
      setTagsList,
      toggleCategory,
    ]
  );

  return (
    <EditGameContext.Provider value={value}>
      {children}
      <UpdateUsername
        open={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        state={usernameState}
        action={usernameAction}
        pending={usernamePending}
      />
    </EditGameContext.Provider>
  );
};

export default EditGameProvider;
