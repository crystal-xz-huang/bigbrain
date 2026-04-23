'use client';

import { ButtonPrimary, SpinnerIcon } from '@/components/ui/button';
import { useToast } from '@/hooks/toast';
import { startSessionAction } from '@/archive/actions';
import { MutateSessionActionResponse } from '@/lib/definitions/types';
import { useActionState, useEffect } from 'react';
import type { Session } from '@/lib/definitions/types';

const initialState: MutateSessionActionResponse = {
  success: false,
  message: '',
};

export default function StartGame({
  sessionId,
  setSession,
  disabled,
  children,
  ...props
}: {
  sessionId: string;
  setSession?: (session: Session) => void;
  disabled?: boolean;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLButtonElement>) {
  const toast = useToast();
  const [state, action, pending] = useActionState(
    startSessionAction.bind(null, sessionId),
    initialState
  );

  useEffect(() => {
    if (state.success && state.message && state.session) {
      toast.success(state.message);
      if (setSession) setSession(state.session);
    } else if (!state.success && state.message) {
      toast.error({
        message: 'Error',
        description: state.message,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.message, state.session]);

  return (
    <>
      {/* Button */}
      <form action={action}>
        <ButtonPrimary
          type="submit"
          color="green"
          disabled={pending || disabled}
          {...props}
        >
          <div className="flex items-center justify-center">
            {pending && <SpinnerIcon />}
            {children || 'Start game'}
          </div>
        </ButtonPrimary>
      </form>
    </>
  );
}
