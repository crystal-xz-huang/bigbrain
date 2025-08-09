'use client';

import { ButtonLink } from '@/components/ui/session/lobby/buttons';
import { lockSessionAction } from '@/lib/actions';
import type { MutateSessionActionResponse, Session } from '@/lib/types';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/16/solid';
import React, { useActionState, useEffect } from 'react';
import { useToast } from '@/hooks/toast';

export default function ToggleGameLock({
  session,
  setSession,
}: {
  session: Session;
  setSession?: (session: Session) => void;
} & Omit<React.HTMLAttributes<HTMLButtonElement>, 'onClick'>) {
  const toast = useToast();
  const initialState: MutateSessionActionResponse = {
    success: false,
    message: '',
    session: session,
  };
  const [state, action, pending] = useActionState(
    lockSessionAction.bind(null, session.id),
    initialState
  );
  const locked = state.session ? state.session.locked : session.locked;

  useEffect(() => {
    if (state.success && state.message && state.session) {
      toast.success(state.message);
      if (setSession) setSession(state.session);
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state.success, state.message, state.session]);

  // ui
  const Icon = locked ? LockOpenIcon : LockClosedIcon;
  const text = locked ? 'Unlock game' : 'Lock game';
  const tooltip = locked
    ? 'Open up again'
    : 'Prevent more players from joining';

  return (
    <form action={action}>
      <input type="hidden" name="locked" value={(!locked).toString()} />
      <ButtonLink
        type="submit"
        name="locked"
        value={(!locked).toString()}
        icon={Icon}
        tooltip={tooltip}
        aria-pressed={locked}
        disabled={pending}
      >
        {text}
      </ButtonLink>
    </form>
  );
}
