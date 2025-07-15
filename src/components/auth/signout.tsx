'use client';

import { Alert, AlertActions, AlertTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/toast';
import { signOutAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignOut({
  children,
  ...props
}: {
  children?: React.ReactNode;
}) {
  const toast = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    setPending(true);
    const response = await signOutAction();
    if (response.success) {
      toast.success({
        message: response.message,
        description: 'See you next time!',
      });
      setIsOpen(false);
      router.push('/login'); // Redirect to login page
    } else {
      toast.error(response.message);
    }
    setPending(false);
  };

  return (
    <>
      {/* Trigger dialog */}
      <Button onClick={() => setIsOpen(true)} {...props}>
        {children || 'Sign Out'}
      </Button>

      {/* Confirmation Dialog */}
      <Alert open={isOpen} onClose={setIsOpen}>
        <AlertTitle>Are you sure you want to sign out?</AlertTitle>
        <AlertActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button color="dark/white" onClick={handleSignOut} disabled={pending}>
            {pending ? 'Signing out...' : 'Sign Out'}
          </Button>
        </AlertActions>
      </Alert>
    </>
  );
}
