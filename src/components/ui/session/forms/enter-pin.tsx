'use client';

import { Button, ButtonLoading } from '@/components/ui/button';
import { ErrorMessage, Field, Label } from '@/components/ui/fieldset';
import { Input } from '@/components/ui/form/input';
import { verifySessionPinAction } from '@/lib/actions';
import type { VerifySessionPinActionResponse } from '@/lib/types';
import clsx from 'clsx';
import Form from 'next/form';
import { useActionState } from 'react';

const initialState: VerifySessionPinActionResponse = {
  success: false,
  message: '',
};

export default function EnterPinForm({ className }: { className?: string }) {
  const [state, action, pending] = useActionState(
    verifySessionPinAction,
    initialState
  );
  const SubmitButton = pending ? ButtonLoading : Button;
  const hasError = !!state?.errors?.pin || !!state?.message;
  const error = (state?.errors?.pin && state.errors.pin[0]) || state?.message;

  return (
    <Form
      action={action}
      className={clsx(
        className,
        'p-6 rounded-lg shadow-lg max-w-xs w-full flex flex-col gap-2'
      )}
    >
      <Field className="w-full">
        <Label htmlFor="pin" className="sr-only">
          Enter Game PIN
        </Label>
        <Input
          id="pin"
          name="pin"
          type="text"
          placeholder="Game PIN"
          defaultValue={state?.inputs?.pin}
          invalid={hasError}
        />
        {hasError && <ErrorMessage>{error}</ErrorMessage>}
      </Field>

      <SubmitButton
        type="submit"
        color="dark/white"
        className="w-full"
        disabled={pending}
      >
        Join Game
      </SubmitButton>
    </Form>
  );
}
