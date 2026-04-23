'use client';

import { Button, ButtonLoading } from '@/components/ui/button';
import { Dialog, DialogActions, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/toast';
import { signOutAction } from '@/lib/actions/auth';
import { ActionResponse, UserDTO } from '@/lib/definitions/types';
import { routes } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';

const initialState: ActionResponse = {
  success: false,
  message: '',
};

export default function SignOutModal({ user }: { user: UserDTO }) {
  const toast = useToast();
  const router = useRouter();
  const [state, action, pending] = useActionState(signOutAction, initialState);
  const SubmitButton = pending ? ButtonLoading : Button;

  useEffect(() => {
    if (state.success && state.message) {
      toast.success(state.message);
      router.push(routes.auth.signin); // Redirect to sign-in page
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.message]);

  return (
    <Dialog open onClose={() => router.back()}>
      <form action={action}>
        <DialogTitle>Are you sure you want to sign out?</DialogTitle>
        <DialogDescription>
          {`Log out of BigBrain as ${user.email || user.username}?`}
        </DialogDescription>
        <DialogActions>
          <Button
            plain
            type="button"
            onClick={() => router.back()}
            disabled={pending}
          >
            Cancel
          </Button>
          <SubmitButton color="dark/white" type="submit">
            {pending ? 'Signing out...' : 'Sign Out'}
          </SubmitButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
