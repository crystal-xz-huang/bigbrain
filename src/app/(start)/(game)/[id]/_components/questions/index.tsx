'use client';

import AddQuestion from '@/components/games/buttons/add-question';
import { Label } from '@/components/ui/fieldset';
import {
  Checkbox,
  CheckboxField,
  CheckboxGroup,
} from '@/components/ui/form/checkbox';
import { Subheading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { GameViewType } from '@/lib/definitions/constants';
import { GameViewDTO } from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import { PublishQuestion } from '@/lib/zod';
import { SquaresPlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import {
  AnswerItem,
  AnswerList,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardWrapper,
} from './card';
import * as z from 'zod';

export default function ViewQuestions({ game }: { game: GameViewDTO }) {
  const [showQuestions, setShowQuestions] = useState(true);
  const [showAnswers, setShowAnswers] = useState(true);
  const isOwner = game.type === GameViewType.PROTECTED;

  if (game.questions.length === 0 && isOwner) {
    return (
      <div className="text-center mt-10">
        <SquaresPlusIcon className="mx-auto size-12" />
        <Subheading level={3} className="mt-2">
          No questions added
        </Subheading>
        <Text className="mt-1">Get started by creating a new question</Text>
        <div className="mt-6">
          <AddQuestion gameId={game.id} />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Toggle Checkbox */}
      <CheckboxGroup className="font-bold text-black">
        <CheckboxField>
          <Checkbox
            name="toggle"
            value="show_questions"
            checked={showQuestions}
            onChange={setShowQuestions}
          />
          <Label className="text-base">Show questions</Label>
        </CheckboxField>
        {isOwner && (
          <CheckboxField>
            <Checkbox
              name="toggle"
              value="show_answers"
              checked={showAnswers}
              onChange={setShowAnswers}
            />
            <Label className="text-base">Show answers</Label>
          </CheckboxField>
        )}
      </CheckboxGroup>

      {/* Questions */}
      <div className='flex flex-row w-[calc(100%+1rem)] flex-wrap items-stretch -mx-2'>
        {game.questions.map((q, idx) => {
          const parsed = PublishQuestion.safeParse(q);
          if (!parsed.success) console.error('Invalid question data:',  z.prettifyError(parsed.error));
          const props = 'id' in q ? { href: routes.game.question(game.id, q.id) } : {};
          return (
          <Card key={idx} invalid={!parsed.success} {...props}>
            <CardHeader>{idx + 1}</CardHeader>
            <CardContent>
              <CardTitle className={showQuestions ? '' : 'blur-sm select-none'}>
                {q.title || '(No text)'}
              </CardTitle>
              <AnswerList className={showAnswers ? '' : 'blur-sm select-none'}>
                {q.answers.length > 0 ? (
                  <>
                    {q.answers.map((answer, idx) => (
                      <AnswerItem
                        key={idx}
                        value={answer.title || '(No text)'}
                        isCorrect={answer.correct}
                      />
                    ))}
                  </>
                ) : (
                  <p className="font-bold">(No answer)</p>
                )}
              </AnswerList>
            </CardContent>
            {'hint' in q && q.hint && <CardFooter>{q.hint}</CardFooter>}
          </Card>
        )})}
      </div>
    </div>
  );
}
