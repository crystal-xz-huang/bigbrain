'use client';

import { signOutAction } from '@/lib/actions';
import { SignOutActionResponse } from '@/lib/types';
import { useActionState } from 'react';
import {
  Alert,
  AlertActions,
  AlertTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Form from 'next/form';

const initialState: SignOutActionResponse = {
  success: false,
  message: '',
};

export default function SignOut() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    signOutAction,
    initialState
  );

  return (
    <>
      {/* Trigger dialog */}
      <Button type="button" onClick={() => setIsOpen(true)}>
        Sign Out
      </Button>

      {/* Confirmation Dialog */}
      <Alert open={isOpen} onClose={setIsOpen}>
        <Form action={formAction}>
          <AlertTitle>Are you sure you want to sign out?</AlertTitle>
          <AlertActions>
            <Button plain type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button color='dark/white' type="submit" disabled={pending} aria-disabled={pending}>
              {pending ? 'Signing out...' : 'Sign Out'}
            </Button>
          </AlertActions>
        </Form>
      </Alert>
    </>
  );
}
