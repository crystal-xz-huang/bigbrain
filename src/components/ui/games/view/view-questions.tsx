'use client';

import { Label } from '@/components/ui/fieldset';
import {
  Checkbox,
  CheckboxField,
  CheckboxGroup,
} from '@/components/ui/form/checkbox';
import AddQuestion from '@/components/ui/games/buttons/add-question';
import {
  AnswerItem,
  AnswerList,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardWrapper,
} from '@/components/ui/games/view/question-card';
import { Subheading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { routes } from '@/lib/routes';
import { QuestionWithAnswers } from '@/lib/types';
import { SquaresPlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function ViewQuestions({
  gameId,
  questions,
}: {
  gameId: string;
  questions: QuestionWithAnswers[];
}) {
  const [showQuestions, setShowQuestions] = useState(true);
  const [showAnswers, setShowAnswers] = useState(true);

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center mt-10">
        <SquaresPlusIcon className="mx-auto size-12" />
        <Subheading level={3} className="mt-2">
          No questions added
        </Subheading>
        <Text className="mt-1">Get started by creating a new question</Text>
        <div className="mt-6">
          <AddQuestion gameId={gameId} />
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
        <CheckboxField>
          <Checkbox
            name="toggle"
            value="show_answers"
            checked={showAnswers}
            onChange={setShowAnswers}
          />
          <Label className="text-base">Show answers</Label>
        </CheckboxField>
      </CheckboxGroup>

      {/* Questions */}
      <CardWrapper>
        {questions.map((q, idx) => (
          <Card
            key={q.id}
            href={routes.game.question.edit(q.gameId, q.id)}
            color={q.answers.length === 0 ? 'error' : 'default'}
          >
            <CardHeader>{idx + 1}</CardHeader>
            <CardContent>
              <CardTitle className={showQuestions ? '' : 'blur-sm select-none'}>
                {q.title || '(No text)'}
              </CardTitle>
              <AnswerList className={showAnswers ? '' : 'blur-sm select-none'}>
                {q.answers.length > 0 ? (
                  <>
                    {q.answers.map((answer) => (
                      <AnswerItem
                        key={answer.id}
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
            {q.hint && <CardFooter>{q.hint}</CardFooter>}
          </Card>
        ))}
      </CardWrapper>
    </div>
  );
}
