'use client';

import { Input } from '@/components/ui/input';
import { Field } from './fieldset';
import { Label } from './listbox';
import { type QuestionDTO } from '@/lib/definitions/types';
import {
  MAX_QUESTION_DURATION,
  MIN_QUESTION_DURATION,
} from '@/lib/definitions/constants';

export default function InputQuestionDuration({
  question,
  setQuestion,
}: {
  question: QuestionDTO;
  setQuestion(q: QuestionDTO): void;
}) {
  return (
    <Field className='bg-glow-neutral-1000'>
      <Label>Time Limit (s)</Label>
      <Input
        type="number"
        value={question.duration}
        className="has-user-valid:focus-within:after:ring-transparent! has-user-valid:focus-within:shadow-none!"
        min={MIN_QUESTION_DURATION}
        max={MAX_QUESTION_DURATION}
        step={5}
        onChange={(e) =>
          setQuestion({
            ...question,
            duration: parseInt(e.target.value, 10),
          })
        }
      />
    </Field>
  );
}
