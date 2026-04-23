'use client';

import EditGameDetails from '@/components/games/forms/edit-game';
import EditGameQuestion from '@/components/games/forms/edit-question';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button, ButtonLoading } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import Tooltip from '@/components/ui/tooltip';
import { useEditGame } from '@/hooks/edit-game';
import { UpdateGameTypeEnum } from '@/lib/definitions/constants';
import { routes } from '@/lib/routes';
import { formatLastUpdated } from '@/lib/utils';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const formatErrors = (errors: string) => {
  return errors.split('\n').map((e, i) => <div key={i}>{e}</div>);
};

export default function EditForm() {
  const { state, action, pending, game } = useEditGame();

  // Scroll to question from URL search params (?question={questionId})
  const searchParams = useSearchParams();
  useEffect(() => {
    const questionId = searchParams.get('question');
    if (questionId) {
      const questionField = document.getElementById(questionId);
      if (questionField) {
        questionField.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [searchParams]);

  const SubmitBtn = pending ? ButtonLoading : Button;

  return (
    <Form action={action} className="flex flex-col space-y-4" noValidate>
      {/* Submit game as JSON string  */}
      <input type="hidden" name="game" value={JSON.stringify(game)} />

      {/* Form Actions */}
      <div className="w-full flex items-center justify-between min-w-0">
        <div className="shrink-0 flex items-center gap-3">
          <Tooltip content="Save changes">
            <SubmitBtn
              type="submit"
              color="white"
              disabled={pending}
              name="updateType"
              value={UpdateGameTypeEnum.SAVE}
            >
              Save
            </SubmitBtn>
          </Tooltip>
          {state?.game?.updatedAt && (
            <Text className="block max-sm:hidden">
              {formatLastUpdated(state.game.updatedAt)}
            </Text>
          )}
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <Tooltip content="Exit without saving changes">
            <Button outline href={routes.game.view(game.id)}>
              Exit
            </Button>
          </Tooltip>
          <Tooltip content="Publish changes">
            <Button
              type="submit"
              color="secondary"
              disabled={pending}
              name="updateType"
              value={UpdateGameTypeEnum.PUBLISH}
            >
              Publish Now
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Form Errors */}
      {state?.errors && (
        <Alert>
          <ExclamationTriangleIcon className="size-4" />
          <AlertTitle className="font-bold">{state.message}</AlertTitle>
          <AlertDescription>{formatErrors(state.errors)}</AlertDescription>
        </Alert>
      )}

      <EditGameDetails />

      {/* Question inputs */}
      {game.questions.map((question, index) => (
        <EditGameQuestion key={index} question={question} index={index} />
      ))}
    </Form>
  );
}
