'use client';

import {
  Button,
  ButtonPrimary,
  PrimaryButtonProps,
  SpinnerIcon,
} from '@/components/ui/button';
import { CopyToClipboardInput } from '@/components/ui/clipboard';
import { DialogWithIcon } from '@/components/ui/dialog';
import { Field, Label } from '@/components/ui/fieldset';
import { useToast } from '@/hooks/toast';
import React, { useActionState, useEffect, useState } from 'react';
// import { startGameAction } from '@/lib/actions/game-session';
// import { StartGameActionResponse } from '@/lib/definitions/types';

const initialState: StartGameActionResponse = {
  success: false,
  message: '',
};

export default function PlayGame() {
  return <div>PlayGame</div>;
}

function PlayGameButton({
  gameId,
  children,
  ...props
}: { gameId: string; disabled?: boolean } & PrimaryButtonProps) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.message, state.sessionId]);

  return (
    <>
      {/* Button */}
      <form>
        <ButtonPrimary
          type="submit"
          color="orange"
          disabled={pending || ('disabled' in props && props.disabled)} // disable if pending or explicitly disabled
          {...props}
        >
          <div className="flex items-center justify-center">
            {pending && <SpinnerIcon />}
            {children || (
              <>
              <span className="md:inline hidden">Play Now</span>
              <span className="md:hidden inline">Play</span>
              </>
            )}
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
        body={<CopySessionId sessionId={state.sessionId} pin={state.pin} />}
      >
        <Button
          href='#'
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
  const sessionUrl = `${window.location.origin}/play/${pin}`;

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
          className="text-accent !text-5xl"
        />
      </Field>
    </>
  );
}
