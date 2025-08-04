'use client';

import { Button, ButtonLoading } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/fieldset';
import { FormAlert } from '@/components/ui/form/alert';
import AddQuestion from '@/components/games/buttons/add-question';
import DeleteGame from '@/components/games/buttons/delete-game';
import DeleteQuestion from '@/components/games/buttons/delete-question';
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
} from '@/components/games/edit-form/input';
import {
  MultipleAnswerInput,
  QuestionField,
  QuestionFieldGroup,
  QuestionLabel,
  SingleAnswerInput,
  TypeAnswerInput,
} from '@/components/games/edit-form/question-input';
import { Input as FieldInput } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { updateGameAction } from '@/lib/actions';
import { routes } from '@/lib/routes';
import type {
  Answer,
  GameWithQuestions,
  QuestionWithAnswers,
  UpdateGameActionResponse,
} from '@/lib/types';
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

const questionTypes: Record<QuestionType, string> = {
  [QuestionType.SINGLE]: 'Single Choice',
  [QuestionType.MULTIPLE]: 'Multiple Choice',
  [QuestionType.TYPE_ANSWER]: 'Type Answer',
};

const initialState: UpdateGameActionResponse = {
  success: false,
  message: '',
};

export default function EditForm({
  game: initialGame,
}: {
  game: GameWithQuestions;
}) {
  const [game, setGame] = useState<GameWithQuestions>(initialGame);
  const [questions, setQuestions] = useState(initialGame.questions);
  const [state, action, pending] = useActionState(
    updateGameAction.bind(null, initialGame.id),
    initialState
  );

  const setQuestion = (updatedQuestion: QuestionWithAnswers) => {
    setQuestions((prev: QuestionWithAnswers[]) =>
      prev.map((q: QuestionWithAnswers) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
    );
  };

  const handleAnswerChange = (
    question: QuestionWithAnswers,
    id: string,
    key: keyof Answer,
    value: string | boolean
  ) => {
    const updatedAnswers = question.answers.map((a) =>
      a.id === id ? { ...a, [key]: value } : a
    );
    setQuestion({ ...question, answers: updatedAnswers });
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

  // Update the question answers when the question type changes
  const changeQuestionType = (
    question: QuestionWithAnswers,
    type: QuestionType
  ) => {
    const newAnswers = generateAnswersForQuestionType(question, type);
    setQuestion({
      ...question,
      type,
      answers: newAnswers,
    });
  };

  const SubmitBtn = pending ? ButtonLoading : Button;

  return (
    <Form className="flex flex-col space-y-4" action={action}>
      <ControlGroup>
        <ControlWrapper className="flex items-center gap-3">
          <SubmitBtn type="submit" color="white">
            Save
          </SubmitBtn>
          {state.game && (
            <Text className="text-xs sm:text-xs">
              Saved {formatLastUpdated(state.game.updatedAt)}
            </Text>
          )}
        </ControlWrapper>
        <ControlWrapper>
          <Button
            type="submit"
            color="primary"
            disabled={pending}
            name="redirectTo"
            value={routes.game.view(initialGame.id)}
          >
            Done
          </Button>
        </ControlWrapper>
      </ControlGroup>

      <FormAlert state={state}>
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
      </FormAlert>

      <Fieldset className="p-4 gap-4 space-y-4 gap-y-0 flex flex-col w-full">
        {/* Game Name */}
        <Field>
          <input type="hidden" name="name" value={game.name} />
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
              name="name"
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
          <input
            type="hidden"
            name="description"
            value={game.description || ''}
          />
          <Label htmlFor="game-description" className="bg-neutral">
            Game description
          </Label>
          <Textarea
            className="bg-neutral"
            id="game-description"
            name="description"
            placeholder="Add a description..."
            value={game.description || ''}
            onChange={(e) => setGame({ ...game, description: e.target.value })}
            maxLength={250}
            rows={4}
          />
        </Field>

        {/* Game Image */}
        <Field>
          <input type="hidden" name="image" value={game.image as string} />
          <ImageInput
            value={game.image}
            onChange={(e) => setGame({ ...game, image: e.target.value })}
          />
        </Field>
      </Fieldset>

      <ControlGroup className="w-full justify-end space-x-4">
        <DeleteGame gameId={game.id} />
        <AddQuestion gameId={game.id} setQuestions={setQuestions} />
      </ControlGroup>

      {/* Question inputs */}
      <input type="hidden" name="questions" value={JSON.stringify(questions)} />

      {questions.map((question: QuestionWithAnswers, idx: number) => (
        <Fieldset key={question.id} id={question.id}>
          <FieldsetHeader>
            <Legend>{idx + 1}</Legend>
            <ControlGroup className="flex justify-end gap-2">
              {idx !== 0 && (
                <DeleteQuestion
                  questionId={question.id}
                  onDelete={() =>
                    setQuestions((prev: QuestionWithAnswers[]) =>
                      prev.filter((q) => q.id !== question.id)
                    )
                  }
                />
              )}
            </ControlGroup>
          </FieldsetHeader>

          <QuestionFieldGroup>
            <FieldGroup className="flex flex-col w-full !space-y-4 gap-y-0">
              {/* Question Title */}
              <Field>
                <Label
                  htmlFor="question-title"
                  className="bg-info"
                  invalid={isEmptyString(question.title)}
                >
                  Question
                </Label>
                <InputGroup className="bg-info">
                  <Input
                    id="question-title"
                    type="text"
                    placeholder="Required"
                    maxLength={75}
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
                  answers={question.answers}
                  handleChange={(id, key, value) =>
                    handleAnswerChange(question, id, key, value)
                  }
                />
              )}
              {question.type === QuestionType.MULTIPLE && (
                <MultipleAnswerInput
                  answers={question.answers}
                  handleChange={(id, key, value) =>
                    handleAnswerChange(question, id, key, value)
                  }
                />
              )}
              {question.type === QuestionType.TYPE_ANSWER && (
                <TypeAnswerInput
                  answers={question.answers}
                  handleChange={(id, key, value) =>
                    handleAnswerChange(question, id, key, value)
                  }
                  addNewAnswer={() => {
                    setQuestion({
                      ...question,
                      answers: [
                        ...question.answers,
                        newAnswer(question.id, true),
                      ],
                    });
                  }}
                />
              )}

              {/* Question Hint */}
              <Field>
                <Label htmlFor="question-hint" className="bg-hint">
                  Hint
                </Label>
                <Textarea
                  className="bg-hint"
                  id="question-hint"
                  placeholder="Optional"
                  maxLength={120}
                  rows={2}
                  value={question.hint || ''}
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
                    htmlFor="question-type"
                    className="min-w-[7rem]"
                  >
                    Question Type
                  </QuestionLabel>
                  <Select
                    id="question-type"
                    value={question.type}
                    onChange={(e) =>
                      changeQuestionType(
                        question,
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
                      <QuestionLabel htmlFor="question-duration">
                        Time (s)
                      </QuestionLabel>
                      <FieldInput
                        className="flex-shrink-0 max-w-fit"
                        id="question-duration"
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
