'use client';

import { Alert, AlertActions, AlertTitle } from '@/components/ui/alert-dialog';
import { Button, ButtonLoading } from '@/components/ui/button';
import { useToast } from '@/hooks/toast';
import { signOutAction } from '@/lib/actions/auth';
import { ActionResponse } from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';

const initialState: ActionResponse = {
  success: false,
  message: '',
};

export default function SignOut({
  children,
  ...props
}: {
  children?: React.ReactNode;
}) {
  const toast = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [state, action, pending] = useActionState(signOutAction, initialState);
  const SubmitButton = pending ? ButtonLoading : Button;

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      setIsOpen(false);
      router.push(routes.auth.signin); // Redirect to sign-in page
    } else if (!state.success && state.message) {
      toast.error(state.message);
      setIsOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.message]);

  return (
    <>
      {/* Dialog Trigger */}
      <Button onClick={() => setIsOpen(true)} {...props}>
        {children || 'Sign Out'}
      </Button>

      {/* Dialog */}
      <Alert open={isOpen} onClose={setIsOpen}>
        <form action={action}>
          <AlertTitle>Are you sure you want to sign out?</AlertTitle>
          <AlertActions>
            <Button plain type='button' onClick={() => setIsOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <SubmitButton
              color="dark/white"
              type="submit"
            >
              {pending ? 'Signing out...' : 'Sign Out'}
            </SubmitButton>
          </AlertActions>
        </form>
      </Alert>
    </>
  );
}
