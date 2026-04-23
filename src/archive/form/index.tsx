'use client';

import AddQuestion from '@/components/games/buttons/add-question';
import DeleteGame from '@/components/games/buttons/delete-game';
import DeleteQuestion from '@/components/games/buttons/delete-question';
import { Button, ButtonLoading } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/fieldset';
import { FormAlert } from '@/components/ui/form/alert';
import { Input as FieldInput } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { updateGameAction } from '@/lib/actions/game';
import {
  MAX_QUESTION_FUNFACT_LENGTH,
  MAX_QUESTION_HINT_LENGTH,
  MAX_QUESTION_TITLE_LENGTH,
  UpdateGameTypes,
} from '@/lib/definitions/constants';
import type {
  AnswerDTO,
  GameEditDTO,
  QuestionDTO,
  UpdateGameActionResponse,
} from '@/lib/definitions/types';
import {
  formatLastUpdated,
  generateAnswersForQuestionType,
  isEmptyString,
  newAnswer,
} from '@/lib/utils';
import { QuestionType } from '@prisma/client';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import {
  ControlGroup,
  ControlWrapper,
  Field,
  Fieldset,
  FieldsetHeader,
  ImageInput,
  Input,
  InputGroup,
  Label,
  Legend,
  Textarea,
} from './input';
import {
  MultipleAnswerInput,
  QuestionField,
  QuestionFieldGroup,
  QuestionLabel,
  SingleAnswerInput,
  TypeAnswerInput,
} from './question-input';

const questionTypes: Record<QuestionType, string> = {
  [QuestionType.SINGLE]: 'Single Choice',
  [QuestionType.MULTIPLE]: 'Multiple Choice',
  [QuestionType.TYPE_ANSWER]: 'Type Answer',
} as const;

// remove the updatedAt from the initial game

export default function EditForm({ game: initialGame }: { game: GameEditDTO }) {
  const initialState: UpdateGameActionResponse = {
    success: false,
    message: '',
    game: initialGame,
  };
  const [game, setGame] = useState(initialGame);
  const [state, action, pending] = useActionState(
    updateGameAction.bind(null, initialGame.id),
    initialState
  );

  const setQuestion = (updated: QuestionDTO) => {
    setGame((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === updated.id ? updated : q)),
    }));
  };

  const onQuestionTypeChange = (questionId: string, type: QuestionType) => {
    setGame((prev) => {
      const q = prev.questions.find((x) => x.id === questionId);
      if (!q) return prev;
      const answers = generateAnswersForQuestionType(q, type);
      return {
        ...prev,
        questions: prev.questions.map((x) =>
          x.id === questionId ? { ...x, type, answers } : x
        ),
      };
    });
  };

  const onAddQuestion = (newQuestion: QuestionDTO) => {
    setGame((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const onDeleteQuestion = (questionId: string) => {
    setGame((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const onAnswerChange = (
    questionId: string,
    answerId: string,
    patch: Partial<AnswerDTO>
  ) => {
    setGame((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id !== questionId
          ? q
          : {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId ? { ...a, ...patch } : a
              ),
            }
      ),
    }));
  };

  const onAddAnswer = (questionId: string, correct = false) => {
    setGame((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id !== questionId
          ? q
          : { ...q, answers: [...q.answers, newAnswer(correct)] }
      ),
    }));
  };

  // Scroll to question from URL search params (?questionId={questionId})
  const searchParams = useSearchParams();
  useEffect(() => {
    const questionId = searchParams.get('questionId');
    if (questionId) {
      const questionField = document.getElementById(questionId);
      if (questionField) {
        questionField.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [searchParams]);

  const SubmitBtn = pending ? ButtonLoading : Button;

  return (
    <Form className="flex flex-col space-y-4" action={action}>
      <ControlGroup>
        <ControlWrapper className="flex items-center gap-3">
          <SubmitBtn
            type="submit"
            color="white"
            title="Save changes"
            disabled={pending}
            name="updateType"
            value={UpdateGameTypes.SAVE}
          >
            Save
          </SubmitBtn>
          {state?.game?.updatedAt && (
            <Text className="text-xs sm:text-xs">
              Saved {formatLastUpdated(state.game.updatedAt)}
            </Text>
          )}
        </ControlWrapper>
        <ControlWrapper className="flex items-center gap-3">
          <Button outline title="Exit without saving" href={`/${game.id}`}>
            Exit
          </Button>
          <Button
            type="submit"
            color="pink"
            title="Publish changes"
            disabled={pending}
            name="updateType"
            value={UpdateGameTypes.PUBLISH}
          >
            Publish Now
          </Button>
        </ControlWrapper>
      </ControlGroup>

      {/* <FormAlert state={state}>
        <ul role="list" className="list-disc space-y-1 pl-5">
          {state?.errors &&
            Object.entries(state.errors).map(([field, messages]) => {
              if (field === 'questions') return null;
              return (messages as string[]).map((msg, i) => (
                <li key={`${field}-${i}`}>{msg}</li>
              ));
            })}

          {state?.errors?.questions &&
            Object.entries(state.errors.questions).map(([idx, messages]) => (
              <li key={`question-${idx}`}>
                <strong>Question {+idx + 1}</strong>
                <ul className="list-disc space-y-1  ml-5 mt-1">
                  {messages.map((msg: string, i: number) => (
                    <li key={`q${idx}-msg-${i}`}>{msg}</li>
                  ))}
                </ul>
              </li>
            ))}
        </ul>
      </FormAlert> */}

      <input type="hidden" name="game" value={JSON.stringify(game)} />

      <Fieldset className="p-4 gap-4 space-y-4 gap-y-0 flex flex-col w-full">
        {/* Game Name */}
        <Field>
          <Label
            htmlFor="game-name"
            className="bg-info"
            invalid={isEmptyString(game.name)}
          >
            Game name
          </Label>
          <InputGroup className="bg-info">
            <Input
              id="game-name"
              type="text"
              placeholder="Add a name..."
              maxLength={75}
              value={game.name}
              onChange={(e) => setGame({ ...game, name: e.target.value })}
            />
          </InputGroup>
        </Field>

        {/* Game Description */}
        <Field>
          <Label htmlFor="game-description" className="bg-neutral">
            Game description
          </Label>
          <Textarea
            className="bg-neutral"
            id="game-description"
            placeholder="Add a description..."
            value={game.description || ''}
            onChange={(e) => setGame({ ...game, description: e.target.value })}
            maxLength={250}
            rows={4}
          />
        </Field>

        {/* Game Image */}
        <Field>
          <ImageInput
            value={game.image || ''}
            onChange={(e) => setGame({ ...game, image: e.target.value })}
          />
        </Field>
      </Fieldset>

      <ControlGroup className="w-full justify-end space-x-4">
        <DeleteGame gameId={game.id} />
        <AddQuestion gameId={game.id} onAdd={onAddQuestion} />
      </ControlGroup>

      {/* Question inputs */}
      {game.questions.map((question, idx: number) => (
        <Fieldset id={question.id} key={question.id}>
          <FieldsetHeader>
            <Legend>{idx + 1}</Legend>
            <ControlGroup className="flex justify-end gap-2">
              {idx !== 0 && (
                <DeleteQuestion
                  questionId={question.id}
                  onDelete={() => onDeleteQuestion(question.id)}
                />
              )}
            </ControlGroup>
          </FieldsetHeader>

          <QuestionFieldGroup>
            <FieldGroup className="flex flex-col w-full !space-y-4 gap-y-0">
              {/* Question Title */}
              <Field>
                <Label
                  htmlFor={`${question.id}-question-title`}
                  className="bg-info"
                  invalid={isEmptyString(question.title)}
                >
                  Question
                </Label>
                <InputGroup className="bg-info">
                  <Textarea
                    id={`${question.id}-question-title`}
                    placeholder="Required"
                    maxLength={MAX_QUESTION_TITLE_LENGTH}
                    value={question.title}
                    onChange={(e) =>
                      setQuestion({ ...question, title: e.target.value })
                    }
                  />
                </InputGroup>
              </Field>

              {/* Question Answers */}
              {question.type === QuestionType.SINGLE && (
                <SingleAnswerInput
                  questionId={question.id}
                  answers={question.answers}
                  onChange={onAnswerChange}
                  onAdd={onAddAnswer}
                />
              )}

              {question.type === QuestionType.MULTIPLE && (
                <MultipleAnswerInput
                  questionId={question.id}
                  answers={question.answers}
                  onChange={onAnswerChange}
                  onAdd={onAddAnswer}
                />
              )}

              {question.type === QuestionType.TYPE_ANSWER && (
                <TypeAnswerInput
                  questionId={question.id}
                  answers={question.answers}
                  onChange={onAnswerChange}
                  onAdd={onAddAnswer}
                />
              )}

              {/* Question Hint */}
              <Field>
                <Label htmlFor="question-hint" className="bg-hint">
                  Hint
                </Label>
                <Textarea
                  className="bg-hint"
                  id={`${question.id}-question-hint`}
                  placeholder="Optional"
                  maxLength={MAX_QUESTION_HINT_LENGTH}
                  rows={2}
                  value={question.hint || ''}
                  onChange={(e) =>
                    setQuestion({ ...question, hint: e.target.value })
                  }
                />
              </Field>

              {/* Question Funfact */}
              <Field>
                <Label
                  htmlFor={`${question.id}-question-funfact`}
                  className="bg-funfact"
                >
                  Fun fact
                </Label>
                <Textarea
                  className="bg-funfact"
                  id={`${question.id}-question-funfact`}
                  placeholder="Optional"
                  maxLength={MAX_QUESTION_FUNFACT_LENGTH}
                  rows={2}
                  value={question.funfact || ''}
                  onChange={(e) =>
                    setQuestion({ ...question, hint: e.target.value })
                  }
                />
              </Field>
            </FieldGroup>

            <FieldGroup className="flex flex-col w-full !space-y-0 gap-2 md:flex-row md:flex-wrap">
              {/* Question Type */}
              <div className="w-full flex-1">
                <QuestionField>
                  <QuestionLabel
                    htmlFor={`${question.id}-question-type`}
                    className="min-w-[7rem]"
                  >
                    Question Type
                  </QuestionLabel>
                  <Select
                    id={`${question.id}-question-type`}
                    value={question.type}
                    onChange={(e) =>
                      onQuestionTypeChange(
                        question.id,
                        e.target.value as QuestionType
                      )
                    }
                  >
                    {Object.values(QuestionType).map((type) => (
                      <option
                        key={type}
                        value={type}
                        className="whitespace-nowrap"
                      >
                        {questionTypes[type]}
                      </option>
                    ))}
                  </Select>
                </QuestionField>
              </div>

              <div className="w-full flex-1">
                <div className="grid grid-cols-2 gap-2 w-full">
                  {/* Question Duration */}
                  <div className="col-span-1">
                    <QuestionField>
                      <QuestionLabel
                        htmlFor={`${question.id}-question-duration`}
                      >
                        Time (s)
                      </QuestionLabel>
                      <FieldInput
                        className="flex-shrink-0 max-w-fit"
                        id={`${question.id}-question-duration`}
                        type="number"
                        value={question.duration}
                        onChange={(e) =>
                          setQuestion({
                            ...question,
                            duration: parseInt(e.target.value, 10),
                          })
                        }
                        min={5}
                        max={300}
                        step={5}
                      />
                    </QuestionField>
                  </div>

                  {/* Question Points */}
                  <div className="col-span-1">
                    <QuestionField>
                      <QuestionLabel
                        htmlFor="question-points"
                        className="font-bold text-sm sm:text-xs"
                      >
                        Points
                      </QuestionLabel>
                      <FieldInput
                        className="flex-shrink-0 max-w-fit"
                        id="question-points"
                        type="number"
                        value={question.points}
                        onChange={(e) =>
                          setQuestion({
                            ...question,
                            points: parseInt(e.target.value, 10),
                          })
                        }
                        min={0}
                        max={300}
                        step={1}
                      />
                    </QuestionField>
                  </div>
                </div>
              </div>
            </FieldGroup>
          </QuestionFieldGroup>
        </Fieldset>
      ))}
    </Form>
  );
}
