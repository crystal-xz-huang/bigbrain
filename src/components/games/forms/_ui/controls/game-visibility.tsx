'use client';

import { GameVisibility } from '@prisma/client';
import { Field } from './fieldset';
import {
  Label,
  Listbox,
  ListboxDescription,
  ListboxLabel,
  ListboxOption,
} from './listbox';

const visibilityOptions = [
  {
    value: GameVisibility.PRIVATE,
    label: 'Private',
    description: 'Visible only to you',
  },
  {
    value: GameVisibility.UNLISTED,
    label: 'Unlisted',
    description: 'Visible to anyone with the link',
  },
  {
    value: GameVisibility.PUBLIC,
    label: 'Public',
    description: 'Make it discoverable by everyone',
  },
];

export default function SelectGameVisibility({
  visibility,
  setVisibility,
}: {
  visibility: GameVisibility;
  setVisibility(next: GameVisibility): void;
}) {
  return (
    <Field>
      <Label>Visibility</Label>
      <Listbox
        value={visibility}
        onChange={(value) => setVisibility(value as GameVisibility)}
      >
        {visibilityOptions.map((option) => (
          <ListboxOption key={option.label} value={option.value}>
            <ListboxLabel>{option.label}</ListboxLabel>
            <ListboxDescription>{option.description}</ListboxDescription>
          </ListboxOption>
        ))}
      </Listbox>
    </Field>
  );
}
