'use client';

import { Button, ButtonLoading } from '@/components/ui/button';
import { useToast } from '@/hooks/toast';
import { cloneQuestionAction } from '@/lib/actions/game';
import { CloneQuestionActionResponse } from '@/lib/definitions/types';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';

const initialState: CloneQuestionActionResponse = {
  success: false,
  message: '',
};

export default function CloneQuestion({ questionId }: { questionId: string }) {
  const toast = useToast();
  const router = useRouter();
  const [state, action, pending] = useActionState(
    cloneQuestionAction.bind(null, questionId),
    initialState
  );

  const ButtonComponent = pending ? ButtonLoading : Button;

  useEffect(() => {
    if (state.success && state.message) {
      // todo: navigate to the cloned question
    } else if (!state.success && state.message) {
      toast.error(state.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success, state.message]);

  return (
    <form action={action}>
      <ButtonComponent
        outline
        type="submit"
        className="!rounded-full size-8"
        aria-label="Clone question"
      >
        <ClipboardDocumentCheckIcon aria-hidden="true" className="!size-4" />
      </ButtonComponent>
    </form>
  );
}
