'use client';

import {
  ButtonGroupItem as Button,
  ButtonGroup,
  ButtonPrimary,
  SpinnerIcon,
} from '@/components/ui/button';
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ErrorMessage,
  Field,
  FieldGroup,
  Fieldset,
} from '@/components/ui/fieldset';
import { PrimaryInput as Input } from '@/components/ui/form/input';
import { ShuffleIcon } from '@/components/ui/icon';
import { createPlayerAction } from '@/lib/actions';
import type { CreatePlayerActionResponse } from '@/lib/types';
import { isEmptyString, isTooLong } from '@/lib/utils';
import { BackwardIcon, ForwardIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useActionState, useState } from 'react';

const initialState: CreatePlayerActionResponse = {
  success: false,
  message: '',
};

export default function CreatePlayerForm({
  pin,
  avatars,
}: {
  pin: string;
  avatars: string[];
}) {
  const [name, setName] = useState('');
  const [idx, setIdx] = useState(0);
  const [state, action, pending] = useActionState(
    createPlayerAction.bind(null, pin),
    initialState
  );

  return (
    <Dialog open={true} onClose={() => {}}>
      <form action={action}>
        <DialogTitle className="text-center">
          You have been invited to a game!
        </DialogTitle>
        <DialogBody>
          <Fieldset className="container px-8 mx-auto">
            <FieldGroup className="flex flex-col items-center justify-center">
              {/* Player Name */}
              <Field className="flex flex-col items-center w-full">
                <Input
                  id="player-name"
                  name="name"
                  type="text"
                  placeholder="Nickname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onClear={() => setName('')}
                  invalid={isEmptyString(name) || isTooLong(name, 25) || !!state?.errors?.name}
                />
                {(isEmptyString(name) || isTooLong(name, 25) || !!state?.errors?.name) && (
                  <ErrorMessage>
                    {isEmptyString(name) && "Name is required"}
                    {!isEmptyString(name) && isTooLong(name, 25) && "Name must be less than 25 characters"}
                    {!isEmptyString(name) && !isTooLong(name, 25) && state?.errors?.name && state.errors.name[0]}
                  </ErrorMessage>
                )}
              </Field>
              {/* Player Image */}
              <Field className="w-full flex flex-col items-center justify-center space-y-8">
                <input type="hidden" name="image" value={avatars[idx]} />
                <Image
                  src={avatars[idx]}
                  alt="avatar"
                  width={100}
                  height={100}
                  className="size-full border-4 border-black rounded-full"
                />
                {!!state?.errors?.image && (
                  <ErrorMessage>{state.errors.image[0]}</ErrorMessage>
                )}
                <div
                  data-slot="control"
                  className="flex flex-row gap-1 md:gap-3"
                >
                  <Button
                    type="button"
                    onClick={() =>
                      setIdx(Math.floor(Math.random() * avatars.length))
                    }
                  >
                    <ShuffleIcon className="icon-3xl" />
                  </Button>
                  <ButtonGroup>
                    <Button
                      type="button"
                      position="first"
                      onClick={() =>
                        setIdx((i) => (i - 1 + avatars.length) % avatars.length)
                      }
                    >
                      <BackwardIcon className="icon-lg" />
                    </Button>
                    <Button
                      type="button"
                      position="last"
                      onClick={() => setIdx((i) => (i + 1) % avatars.length)}
                    >
                      <ForwardIcon className="icon-lg" />
                    </Button>
                  </ButtonGroup>
                </div>
              </Field>
            </FieldGroup>
          </Fieldset>
        </DialogBody>
        <DialogActions>
          <ButtonPrimary
            type="reset"
            color="error"
            className="py-3 px-6 text-error-content"
            disabled={pending}
          >
            Clear
          </ButtonPrimary>
          <ButtonPrimary
            type="submit"
            color="success"
            className="py-3 px-6 text-success-content"
            disabled={pending}
          >
            <div className="flex items-center justify-center">
              {pending && <SpinnerIcon />}
              <span>Done</span>
            </div>
          </ButtonPrimary>
        </DialogActions>
      </form>
    </Dialog>
  );
}
