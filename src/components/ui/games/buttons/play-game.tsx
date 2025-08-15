'use client';

import { Button, ButtonPrimary, PrimaryButtonProps, SpinnerIcon } from '@/components/ui/button';
import { CopyToClipboardInput } from '@/components/ui/clipboard';
import { DialogWithIcon } from '@/components/ui/dialog';
import { Field, Label } from '@/components/ui/fieldset';
import { useToast } from '@/hooks/toast';
import { startGameAction } from '@/lib/actions';
import { routes } from '@/lib/routes';
import { StartGameActionResponse } from '@/lib/types';
import { useActionState, useEffect, useState } from 'react';

const initialState: StartGameActionResponse = {
  success: false,
  message: '',
};

export default function PlayGame({
  gameId,
  ...props
}: {
  gameId: string;
  disabled?: boolean;
} & PrimaryButtonProps) {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, pending] = useActionState(
    startGameAction.bind(null, gameId),
    initialState
  );

  useEffect(() => {
    if (state.success && state.sessionId) {
      setIsOpen(true);
    } else if (!state.success && state.message) {
      toast.error({
        message: 'Error',
        description: state.message,
      });
    }
  }, [state.success, state.message, state.sessionId]);

  return (
    <>
      {/* Button */}
      <form action={action}>
        <ButtonPrimary
          type="submit"
          disabled={pending || (props.disabled ?? false)}
          {...props}
        >
          <div className="flex items-center justify-center">
            {pending && <SpinnerIcon />}
            <span className="md:inline hidden">Play Now</span>
            <span className="md:hidden inline">Play</span>
          </div>
        </ButtonPrimary>
      </form>

      {/* Modal */}
      <DialogWithIcon
        variant="success"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Game Started!"
        description="Share the link below with your friends."
        body={
          <CopySessionId
            sessionId={state.sessionId}
            pin={state.pin}
          />
        }
      >
        <Button
          href={state.sessionId ? routes.session.play(state.sessionId) : '#'}
          className="inline-flex w-full justify-center sm:ml-3 sm:w-auto"
          color="success"
        >
          Lobby <span aria-hidden="true">&rarr;</span>
        </Button>
        <Button
          plain
          type="button"
          className="mt-3 inline-flex w-full justify-center sm:mt-0 sm:w-auto "
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
      </DialogWithIcon>
    </>
  );
}

function CopySessionId({
  sessionId,
  pin,
}: {
  sessionId?: string;
  pin?: string;
}) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  if (!sessionId || !pin) return null;

  const sessionUrl = `${window.location.origin}${routes.player.play(pin)}`;

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(sessionUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success({ message: 'Copied to clipboard.' });
      })
      .catch((error) => {
        console.error('Failed to copy:', error);
      });
  };

  return (
    <>
      <Field>
        <Label htmlFor="session-url">PIN code:</Label>
        <CopyToClipboardInput
          id="session-url"
          value={pin}
          copied={copied}
          onCopy={copyToClipboard}
          className='text-accent !text-5xl'
        />
      </Field>
    </>
  );
}
