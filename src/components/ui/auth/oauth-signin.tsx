'use client';

import { AuthButton } from '@/components/ui/auth-button';
import { Subheading } from '@/components/ui/heading';
import { providerMap } from '@/lib/auth.config';
import { signIn } from 'next-auth/react';

export default function OAuthSignIn({
  pending,
  callbackUrl,
  ...props
}: {
  pending: boolean;
  callbackUrl: string;
}) {
  return (
    <div className="flex flex-col space-y-4">
      <Subheading className="font-medium!">
        Connect to BigBrain with:
      </Subheading>
      <div className="grid grid-cols-2 gap-4">
        {Object.values(providerMap).map((provider) => (
          <AuthButton
            key={provider.id}
            provider={provider}
            onClick={() => signIn(provider.id, { callbackUrl })}
            disabled={pending}
            aria-disabled={pending}
            {...props}
          />
        ))}
      </div>
    </div>
  );
}
