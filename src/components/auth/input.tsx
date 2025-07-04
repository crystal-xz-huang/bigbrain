import { ErrorMessage, Field, Label } from '@/components/fieldset'
import { Input as FormInput } from '@/components/input'
import clsx from 'clsx';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';

export function Input({ name, errors }: { name: string; errors: Map<string, string> }) {
  return (
    <Field>
      <Label>Full name</Label>
      <FormInput name={name} id={name} invalid={errors.has(name)} />
      {errors.has(name) && <ErrorMessage>{errors.get(name)}</ErrorMessage>}
    </Field>
  )
}

export function InputError({ className, ...props }) {
  return (
    <div className={clsx(className, 'relative w-full')}>
      <div className="my-2 grid grid-cols-1">
        <FormInput
          className={clsx('col-start-1 row-start-1 before:hidden')}
          {...props}
        />
        {props.invalid && (
          <ExclamationCircleIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-3 size-5 self-center justify-self-end text-red-500 sm:size-4"
          />
        )}
      </div>
    </div>
  );
}
