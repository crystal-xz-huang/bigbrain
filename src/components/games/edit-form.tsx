'use client';

import { FormAlert } from '@/components/ui/form/alert';
import AddQuestion from '@/components/games/buttons/add-question';
import DeleteGame from '@/components/games/buttons/delete-game';
import DeleteQuestion from '@/components/games/buttons/delete-question';
import { Button, ButtonLoading } from '@/components/ui/button';
import { Label as FieldLabel } from '@/components/ui/fieldset';
import {
  Field,
  Fieldset,
  Header,
  ImageInput,
  Input,
  InputGroup,
  Label,
  QuestionAnswersInput,
  Textarea,
} from '@/components/ui/form/edit-game';
import { Input as FieldInput } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { updateGameAction } from '@/lib/actions';
import type {
  GameWithQuestions,
  QuestionWithAnswers,
  UpdateGameActionResponse,
} from '@/lib/types';
import { formatLastUpdated, isEmptyString } from '@/lib/utils';
import * as Headless from '@headlessui/react';
import { Bars2Icon } from '@heroicons/react/20/solid';
import { QuestionType } from '@prisma/client';
import Form from 'next/form';
import { useActionState, useState } from 'react';

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
  const setQuestion = (updatedQuestion: QuestionWithAnswers) => {
    setQuestions((prev: QuestionWithAnswers[]) =>
      prev.map((q: QuestionWithAnswers) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
    );
  };
  const [state, action, pending] = useActionState(
    updateGameAction.bind(null, initialGame.id),
    initialState
  );
  const SubmitBtn = pending ? ButtonLoading : Button;

  return (
    <Form className="flex flex-col space-y-4" action={action}>
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-baseline gap-3">
          <Button
            type="button"
            color="white"
            className="!text-sm !px-2.5 !py-1.5"
          >
            Done
          </Button>
          {state?.success && state.game && (
            <Text className="text-xs sm:text-xs">
              Saved {formatLastUpdated(state.game.updatedAt)}
            </Text>
          )}
        </div>
        <div>
          {/* save */}
          <SubmitBtn
            type="submit"
            color="accent"
            className="!text-sm !px-2.5 !py-1.5"
          >
            Save
          </SubmitBtn>
        </div>
      </div>

      <FormAlert state={state}>
        <ul role="list" className="list-disc space-y-1 pl-5">
          {/* Non-question field errors */}
          {state?.errors &&
            Object.entries(state.errors).map(([field, messages]) => {
              if (field === 'questions') return null;
              return (messages as string[]).map((msg, i) => (
                <li key={`${field}-${i}`}>{msg}</li>
              ));
            })}

          {/* Grouped question errors */}
          {state?.errors?.questions &&
            Object.entries(state.errors.questions).map(([idx, messages]) => (
              <li key={`question-${idx}`}>
                <h4>Question {+idx + 1}</h4>
                <ul className="list-disc space-y-1  ml-5 mt-1">
                  {messages.map((msg, i) => (
                    <li key={`q${idx}-msg-${i}`}>{msg}</li>
                  ))}
                </ul>
              </li>
            ))}
        </ul>
      </FormAlert>

      {/* Game Inputs */}
      <Fieldset className="p-4 gap-4 space-y-4 gap-y-0 flex flex-col w-full">
        {/* Game Name */}
        <input type="hidden" name="name" value={game.name} />
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
          <input type="hidden" name="description" value={game.description} />
          <Label htmlFor="game-description" className="bg-neutral">
            Game description
          </Label>
          <Textarea
            className="bg-neutral"
            id="game-description"
            name="description"
            placeholder="Add a description..."
            value={game.description}
            onChange={(e) => setGame({ ...game, description: e.target.value })}
            maxLength={250}
            rows={4}
          />
        </Field>

        {/* Game Image */}
        <Field>
          <input type="hidden" name="image" value={game.image} />
          <ImageInput
            value={game.image}
            onChange={(e) => setGame({ ...game, image: e.target.value })}
          />
        </Field>
      </Fieldset>

      <div className=" w-full flex justify-end items-center space-x-4">
        <DeleteGame gameId={game.id} />
        <AddQuestion gameId={game.id} setQuestions={setQuestions} />
      </div>

      <input type="hidden" name="questions" value={JSON.stringify(questions)} />

      {/* Edit Question Form */}
      {questions.map((question, idx) => (
        <Fieldset key={question.id}>
          <Header>
            <span>{idx + 1}</span>
            <div className="flex items-center gap-2">
              <Button
                plain
                type="button"
                className="!rounded-full size-8"
                title="Drag to reorder"
                aria-label="drag"
              >
                <Bars2Icon aria-hidden="true" className="!size-4" />
              </Button>
              {idx !== 0 && (
                <DeleteQuestion
                  questionId={question.id}
                  onDelete={() =>
                    setQuestions((prev) =>
                      prev.filter((q) => q.id !== question.id)
                    )
                  }
                />
              )}
            </div>
          </Header>

          <div className="p-4 gap-4 flex flex-col items-start">
            <div className="flex flex-col w-full space-y-4 gap-y-0">
              {/* Question Title */}
              <div className="flex flex-col w-full">
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
              </div>

              {/* Question Answers */}
              <QuestionAnswersInput
                question={question}
                setQuestion={setQuestion}
              />
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:flex-wrap w-full">
              {/* Question Type */}
              <div className="w-full flex-1">
                <Headless.Field className="flex items-center gap-3 px-4 py-2 bg-black/10 dark:bg-black/30 rounded-lg">
                  <FieldLabel
                    htmlFor="question-type"
                    className="font-bold text-sm sm:text-xs whitespace-nowrap min-w-[7rem]"
                  >
                    Question Type
                  </FieldLabel>
                  <Select
                    id="question-type"
                    value={question.type}
                    onChange={(e) =>
                      setQuestion({
                        ...question,
                        type: e.target.value as QuestionType,
                      })
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
                </Headless.Field>
              </div>
              <div className="w-full flex-1">
                <div className="grid grid-cols-2 gap-2 w-full">
                  {/* Question Duration */}
                  <div className="col-span-1">
                    <Headless.Field className="flex items-center justify-between gap-3 px-4 py-2 bg-black/10 dark:bg-black/30 rounded-lg">
                      <FieldLabel
                        htmlFor="question-duration"
                        className="font-bold text-sm sm:text-xs whitespace-nowrap"
                      >
                        Time (s)
                      </FieldLabel>
                      <FieldInput
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
                        className="flex-shrink-0 max-w-fit"
                      />
                    </Headless.Field>
                  </div>
                  {/* Question Points */}
                  <div className="col-span-1">
                    <Headless.Field className="flex items-center justify-between gap-3 px-4 py-2 bg-black/10 dark:bg-black/30 rounded-lg">
                      <FieldLabel
                        htmlFor="question-points"
                        className="font-bold text-sm sm:text-xs"
                      >
                        Points
                      </FieldLabel>
                      <FieldInput
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
                        className="flex-shrink-0 max-w-fit"
                      />
                    </Headless.Field>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fieldset>
      ))}
    </Form>
  );
}
