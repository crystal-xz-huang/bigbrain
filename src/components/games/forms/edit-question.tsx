'use client';

import DeleteQuestion from '@/components/games/buttons/delete-question';
import { useEditGame } from '@/hooks/edit-game';
import {
  MAX_QUESTION_FUNFACT_LENGTH,
  MAX_QUESTION_HINT_LENGTH,
  MAX_QUESTION_TITLE_LENGTH,
} from '@/lib/definitions/constants';
import type { QuestionDTO } from '@/lib/definitions/types';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from './_ui/card';
import {
  InputQuestionAnswers,
  InputQuestionDuration,
  SelectQuestionPoints,
  SelectQuestionType,
} from './_ui/controls';
import { Field, InputGroup, Label, Textarea } from './_ui/fieldset';

export default function EditGameQuestion({
  index,
  question,
}: {
  index: number;
  question: QuestionDTO;
}) {
  const { game, setQuestion, onAddAnswer, onDeleteQuestion } = useEditGame();

  return (
    <Card id={question.id}>
      <CardHeader>
        <CardTitle>{index + 1}</CardTitle>
        <CardAction>
          {game.questions.length > 1 && (
            <DeleteQuestion
              questionId={question.id}
              onDelete={() => onDeleteQuestion(question.id)}
            />
          )}
        </CardAction>
      </CardHeader>

      <CardContent>
        {/* Title */}
        <Field color="cyan">
          <Label>Question</Label>
          <InputGroup>
            <Textarea
              required
              placeholder="Required"
              maxLength={MAX_QUESTION_TITLE_LENGTH}
              value={question.title}
              onChange={(e) =>
                setQuestion({ ...question, title: e.target.value })
              }
            />
          </InputGroup>
        </Field>

        {/* Answers */}
        <InputQuestionAnswers
          question={question}
          setQuestion={setQuestion}
          onAddAnswer={onAddAnswer}
        />

        {/* Hint */}
        <Field color="blue">
          <Label>Hint</Label>
          <InputGroup>
            <Textarea
              placeholder="Optional"
              maxLength={MAX_QUESTION_HINT_LENGTH}
              rows={2}
              value={question.hint || ''}
              onChange={(e) =>
                setQuestion({ ...question, hint: e.target.value })
              }
            />
          </InputGroup>
        </Field>

        {/* Funfact */}
        <Field color="charcoal">
          <Label>Fun fact</Label>
          <InputGroup>
            <Textarea
              placeholder="Optional"
              maxLength={MAX_QUESTION_FUNFACT_LENGTH}
              rows={2}
              value={question.funfact || ''}
              onChange={(e) =>
                setQuestion({ ...question, funfact: e.target.value })
              }
            />
          </InputGroup>
        </Field>

        {/* Type, Points, Duration */}
        <SelectQuestionType question={question} setQuestion={setQuestion} />
        <SelectQuestionPoints question={question} setQuestion={setQuestion} />
        <InputQuestionDuration question={question} setQuestion={setQuestion} />
      </CardContent>
    </Card>
  );
}
