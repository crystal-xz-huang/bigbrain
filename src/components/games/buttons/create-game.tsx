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
import { useToast } from '@/hooks/toast';
import { createGameAction } from '@/lib/actions/game';
import { CreateGameActionResponse } from '@/lib/definitions/types';
import { PlusIcon } from '@heroicons/react/24/outline';
import Form from 'next/form';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { routes } from '@/lib/routes';

const initialState: CreateGameActionResponse = {
  success: false,
  message: '',
};

export default function CreateGameButton({
  redirectTo,
}: {
  redirectTo?: string;
}) {
  const toast = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [state, action, pending] = useActionState(
    createGameAction,
    initialState
  );
  const SubmitButton = pending ? ButtonLoading : Button;

  useEffect(() => {
    if (state.success && state.message && state.gameId) {
      toast.success(state.message);
      setOpen(false);
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push(routes.game.view(state.gameId));
      }
    } else if (!state.success && state.message) {
      toast.error({
        message: 'Error',
        description: state.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.message]);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        <PlusIcon className="size-5 stroke-5" />
        Create Game
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Form action={action}>
          <DialogTitle>Create a new game</DialogTitle>
          <DialogDescription>Enter a name for your new game.</DialogDescription>
          <DialogBody>
            <Field>
              <Label htmlFor="game-name" required>
                Name
              </Label>
              <Input
                type="text"
                id="game-name"
                name="name"
                placeholder="My awesome game"
                aria-describedby="game-name-error"
                invalid={!!state?.errors?.name && state.errors.name.length > 0}
                defaultValue={state?.inputs?.name}
                autoFocus
              />
              {state?.errors?.name && (
                <ErrorMessage id="game-name-error">
                  {state.errors.name[0]}
                </ErrorMessage>
              )}
            </Field>
          </DialogBody>
          <DialogActions>
            <Button plain type="button" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <SubmitButton type="submit">Create</SubmitButton>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
}
