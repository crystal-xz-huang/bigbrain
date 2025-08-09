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
import { createGameAction } from '@/lib/actions';
import { CreateGameActionResponse } from '@/lib/types';
import Form from 'next/form';
import { useRouter } from 'next/navigation';
import React, {
  cloneElement,
  isValidElement,
  useActionState,
  useEffect,
  useState,
} from 'react';

const initialState: CreateGameActionResponse = {
  success: false,
  message: '',
};

export default function CreateGameTrigger({
  children,
}: {
  children: React.ReactElement<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'button'
  >;
}) {
  const router = useRouter();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, pending] = useActionState(
    createGameAction,
    initialState
  );
  const ButtonComponent = pending ? ButtonLoading : Button;

  useEffect(() => {
    if (state.success && state.message) {
      setIsOpen(false);
      toast.success({
        message: 'Success',
        description: state.message,
      });
      router.refresh(); // refresh the current page
    } else if (!state.success && state.message) {
      toast.error({
        message: 'Error',
        description: state.message,
      });
    }
  }, [state.success, state.message]);

  const trigger = isValidElement(children)
    ? cloneElement(children, {
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          children.props.onClick?.(e);
          setIsOpen(true);
        },
        disabled: pending || children.props.disabled,
      })
    : null;

  return (
    <>
      {/* Button */}
      {trigger}

      {/* Modal */}
      <Dialog open={isOpen} onClose={setIsOpen}>
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
            <Button
              plain
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <ButtonComponent type="submit">Create</ButtonComponent>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
}
