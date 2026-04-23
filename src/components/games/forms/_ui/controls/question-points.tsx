'use client';

import { QuestionPoint } from '@/lib/definitions/constants';
import { type QuestionDTO } from '@/lib/definitions/types';
import { Field } from './fieldset';
import {
  Label,
  Listbox,
  ListboxDescription,
  ListboxLabel,
  ListboxOption,
} from './listbox';

const pointOptions = [
  {
    value: QuestionPoint.NONE,
    label: 'No Points',
    description: 'Lower the stakes with no points',
  },
  {
    value: QuestionPoint.STANDARD,
    label: 'Standard',
    description: 'Award correct answers with 1 point',
  },
  {
    value: QuestionPoint.DOUBLE,
    label: 'Double',
    description: 'Double the points for correct answers',
  },
  {
    value: QuestionPoint.TRIPLE,
    label: 'Triple',
    description: 'Triple the points for correct answers',
  },
];

export default function SelectQuestionPoints({
  question,
  setQuestion,
}: {
  question: QuestionDTO;
  setQuestion(q: QuestionDTO): void;
}) {
  return (
    <Field>
      <Label>Points</Label>
      <Listbox
        value={question.points}
        onChange={(value) => {
          setQuestion({ ...question, points: value });
        }}
      >
        {pointOptions.map((option) => (
          <ListboxOption key={option.label} value={option.value}>
            <ListboxLabel>{option.label}</ListboxLabel>
            <ListboxDescription>{option.description}</ListboxDescription>
          </ListboxOption>
        ))}
      </Listbox>
    </Field>
  );
}
