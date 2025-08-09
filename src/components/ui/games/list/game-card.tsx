'use client';

import { Badge } from '@/components/ui/badge';
import { ButtonPrimary } from '@/components/ui/button';
import { DialogWithIcon } from '@/components/ui/dialog';
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
} from '@/components/ui/dropdown';
import {
  DeleteDropdownItem,
  EditDropdownItem,
  ViewDropdownItem,
} from '@/components/ui/dropdown-items';
import { useToast } from '@/hooks/toast';
import { deleteGameAction } from '@/lib/actions';
import { routes } from '@/lib/routes';
import type { AdminGame } from '@/lib/types';
import {
  formatTime,
  pluralSuffix,
  totalDuration,
  totalNumberOfQuestions,
} from '@/lib/utils';
import { EllipsisHorizontalIcon } from '@heroicons/react/16/solid';
import { ClockIcon, Square2StackIcon } from '@heroicons/react/20/solid';
import type { Question } from '@prisma/client';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import {
  Card,
  CardCover,
  CardCoverImage,
  CardAction,
  CardBadge,
  CardFooter,
  CardTitle,
  CardDescription,
  CardIndicator,
} from '@/components/ui/game-card';
import { Link } from '@/components/ui/link';

export default function GameCard({ game }: { game: AdminGame }) {
  return (
    <Card>
      <CardIndicator active={!!game.active} />
      <CardCover>
        <CardCoverImage src={game.image} alt={game.name} />
        <CardAction>
          <ButtonPrimary
            className="w-50 h-14 lg:w-32 lg:text-base p-0"
            href={routes.game.view(game.id)}
          >
            View
          </ButtonPrimary>
        </CardAction>
        {game.active && <CardBadge>In Progress</CardBadge>}
      </CardCover>
      <CardFooter>
        <CardTitle>
          <Link
            className="hover:underline"
            title={game.name}
            href={routes.game.view(game.id)}
          >
            {game.name}
          </Link>
        </CardTitle>
        <CardDescription>
          <div className="flex flex-row items-center justify-between gap-2">
            <GameMetadata questions={game.questions} />
            <GameDropdown game={game} />
          </div>
        </CardDescription>
      </CardFooter>
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

function GameDropdown({ game }: { game: AdminGame }) {
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
          className="h-full"
        >
          <EllipsisHorizontalIcon aria-hidden="true" />
        </DropdownButton>
        <DropdownMenu>
          <ViewDropdownItem href={routes.game.view(game.id)} />
          <EditDropdownItem href={routes.game.edit(game.id)} />
          <DeleteDropdownItem onClick={() => setIsOpen(true)} />
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
        'flex flex-row items-center space-x-2 min-w-0 justify-start',
        className
      )}
    >
      <Badge
        color="indigo"
        className="flex grow-0 shrink-0 text-xs/5 items-center"
      >
        <ClockIcon aria-hidden="true" className="size-4" />
        <span className="sm:hidden">{formatTime(duration)}</span>
        <span className="hidden sm:inline">{duration}</span>
      </Badge>
      <Badge
        color="fuchsia"
        className="flex grow-0 shrink-0 text-xs/5 items-center"
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
