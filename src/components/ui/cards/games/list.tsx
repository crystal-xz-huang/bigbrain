'use client';

import { Badge } from '@/components/ui/badge';
import { DialogWithIcon } from '@/components/ui/dialog';
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from '@/components/ui/dropdown';
import { Button } from '@/components/ui/styled/button';
import { useToast } from '@/hooks/toast';
import { deleteGameAction } from '@/lib/actions';
import { routes } from '@/lib/routes';
import type { GameWithQuestions } from '@/lib/types';
import {
  formatTime,
  pluralSuffix,
  totalDuration,
  totalNumberOfQuestions,
} from '@/lib/utils';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import { ClockIcon, Square2StackIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import {
  Card,
  CardAction,
  CardBadge,
  CardContent,
  CardHeader,
  CardIndicator,
  CardThumbnail,
  CardTitle,
} from './card';

export default function Game({ game }: { game: GameWithQuestions }) {
  return (
    <Card className={clsx(!!game.active && 'outline-2 outline-emerald-500/50')}>
      <CardHeader>
        <CardThumbnail src={game.image} alt={game.name} />
        <CardAction>
          <Button
            className="text-lg w-50 h-14 lg:w-32 lg:text-base p-0"
            href={routes.game.view(game.id)}
          >
            View
          </Button>
        </CardAction>
        {game.active && <CardBadge>In Progress</CardBadge>}
      </CardHeader>
      <CardContent>
        {game.active ? (
          <CardTitle>{game.name}</CardTitle>
        ) : (
          <CardTitle href={routes.game.view(game.id)}>{game.name}</CardTitle>
        )}
        <div className="flex flex-row justify-between pt-1">
          <GameMetadata questions={game.questions} />
          <GameDropdown game={game} />
        </div>
      </CardContent>
      <CardIndicator active={!!game.active} />
    </Card>
  );
}

/***************************************************************
                     Dropdown Menu
***************************************************************/
const initialState = {
  success: false,
  message: '',
};

function GameDropdown({ game }: { game: GameWithQuestions }) {
  const router = useRouter();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const deleteGameWithId = deleteGameAction.bind(null, game.id);
  const [state, action, pending] = useActionState(
    deleteGameWithId,
    initialState
  );

  useEffect(() => {
    if (state.success && state.message) {
      toast.success({
        message: 'Success',
        description: state.message,
      });
      setIsOpen(false);
      router.refresh(); // refresh the current page
    } else if (!state.success && state.message) {
      toast.error({
        message: 'Error',
        description: state.message,
      });
    }
  }, [state.success, state.message]);

  return (
    <>
      <Dropdown>
        <DropdownButton
          plain
          aria-label="More options"
          disabled={!!game.active}
          className="size-6"
        >
          <EllipsisHorizontalIcon aria-hidden="true" className="!size-4" />
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem href={routes.game.view(game.id)}>View</DropdownItem>
          <DropdownItem href={routes.game.edit(game.id)}>Edit</DropdownItem>
          <DropdownItem onClick={() => setIsOpen(true)}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <DialogWithIcon
        variant="error"
        open={isOpen}
        pending={pending}
        title="Delete this game?"
        description="Are you sure you want to delete this game? This action cannot be undone."
        actionText="Delete"
        onClose={() => setIsOpen(false)}
        action={action}
      />
    </>
  );
}

/***************************************************************
                     Metadata
***************************************************************/
function GameMetadata({
  className,
  questions,
}: {
  className?: string;
  questions: Question[];
}) {
  const duration = totalDuration(questions);
  const questionsCount = totalNumberOfQuestions(questions);

  return (
    <div
      className={clsx(
        'flex flex-row items-center space-x-2 flex-shrink-0 min-w-0 justify-start',
        className
      )}
    >
      <Badge
        color="indigo"
        className="flex flex-shrink-0 text-xs/5 items-center"
      >
        <ClockIcon aria-hidden="true" className="size-4" />
        <span className="sm:hidden">{formatTime(duration)}</span>
        <span className="hidden sm:inline">{duration}</span>
      </Badge>
      <Badge
        color="fuchsia"
        className="flex flex-shrink-0 text-xs/5 items-center"
      >
        <Square2StackIcon aria-hidden="true" className="size-4" />
        <span className="sm:hidden">
          {questionsCount} question{pluralSuffix(questionsCount)}
        </span>
        <span className="hidden sm:inline">{questionsCount}</span>
      </Badge>
    </div>
  );
}
