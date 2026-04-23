'use client';

import { type QuestionDTO } from '@/lib/definitions/types';
import { QuestionType } from '@prisma/client';
import { Field } from './fieldset';
import {
  Label,
  Listbox,
  ListboxDescription,
  ListboxLabel,
  ListboxOption,
} from './listbox';

const typeOptions = [
  {
    value: QuestionType.SINGLE,
    label: 'Single Choice',
    description: 'Players can only select one of the answers',
  },
  {
    value: QuestionType.MULTIPLE,
    label: 'Multiple Choice',
    description: 'Players can select multiple answers',
  },
  {
    value: QuestionType.TYPE_ANSWER,
    label: 'Type Answer',
    description: 'Players type in the answer',
  },
];

export default function SelectQuestionType({
  question,
  setQuestion,
}: {
  question: QuestionDTO;
  setQuestion(q: QuestionDTO): void;
}) {
  return (
    <Field>
      <Label>Question Type</Label>
      <Listbox
        value={question.type}
        onChange={(value) => {
          setQuestion({ ...question, type: value });
        }}
      >
        {typeOptions.map((option) => (
          <ListboxOption key={option.label} value={option.value}>
            <ListboxLabel>{option.label}</ListboxLabel>
            <ListboxDescription>{option.description}</ListboxDescription>
          </ListboxOption>
        ))}
      </Listbox>
    </Field>
  );
}
