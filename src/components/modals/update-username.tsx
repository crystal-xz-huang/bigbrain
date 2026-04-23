'use client';

import { Button, ButtonLoading } from '@/components/ui/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { ErrorMessage, Field, Label } from '@/components/ui/fieldset';
import { Input } from '@/components/ui/form/input';
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@/lib/definitions/constants';
import { UpdateUsernameActionResponse } from '@/lib/definitions/types';
import Form from 'next/form';

export default function UpdateUsername({
  open,
  onClose,
  state,
  action,
  pending,
}: {
  open: boolean;
  onClose(): void;
  state: UpdateUsernameActionResponse | null;
  action: (formData: FormData) => void;
  pending: boolean;
}) {
  const SubmitButton = pending ? ButtonLoading : Button;

  return (
    <Dialog open={open} onClose={onClose}>
      <Form action={action}>
        <DialogTitle>Change your username</DialogTitle>
        <DialogDescription>
          Your username is currently invalid for public sharing!
          Before we can proceed, please change your username to a more personalised name of your choice.
          Choose wisely! This will be used as your public identifier on the platform.
        </DialogDescription>
        <DialogBody>
          <Field>
            <Label>
              Username
            </Label>
            <Input
              type="text"
              name="username"
              placeholder="New username"
              invalid={!!state?.errors?.username && state.errors.username.length > 0}
              defaultValue={state?.inputs?.username}
              min={MIN_USERNAME_LENGTH}
              max={MAX_USERNAME_LENGTH}
              required
              autoFocus
            />
            {state?.errors?.username && (
              <ErrorMessage>{state.errors.username[0]}</ErrorMessage>
            )}
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain type="button" onClick={onClose}>
            Cancel
          </Button>
          <SubmitButton type="submit">
            Save username and continue
          </SubmitButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
