'use client';

import { Button } from '@/components/ui/button';
import { ArrowUturnLeftIcon, ArrowUturnRightIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';

export function GoBackButton({ ...props }) {
  const router = useRouter();
  const handleGoBack = () => router.back();

  return (
    <Button onClick={handleGoBack} {...props}>
      <ArrowUturnLeftIcon />
      Go Back
    </Button>
  );
}

export function GoForwardButton({ ...props }) {
  const router = useRouter();
  const handleGoForward = () => router.forward();

  return (
    <Button onClick={handleGoForward} {...props}>
      <ArrowUturnRightIcon />
      Go Forward
    </Button>
  );
}