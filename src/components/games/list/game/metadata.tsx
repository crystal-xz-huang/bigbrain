'use client';

import { Badge } from '@/components/ui/badge';
import { formatDuration, pluralize } from '@/lib/utils';
import { ClockIcon, Square2StackIcon } from '@heroicons/react/20/solid';

/***************************************************************
                     Game Metadata
      display game details like duration and question count
***************************************************************/

export default function GameMetadata({
  questionCount,
  duration,
}: {
  questionCount: number;
  duration: number;
}) {
  return (
    <div className="flex flex-row items-center space-x-2">
      <Badge
        color="indigo"
        className="flex flex-row items-center justify-center"
      >
        <ClockIcon aria-hidden="true" className="size-4" />
        <span>{formatDuration(duration)}</span>
      </Badge>

      <Badge
        color="fuchsia"
        className="flex flex-row items-center justify-center"
      >
        <Square2StackIcon aria-hidden="true" className="size-4" />
        <span className="sm:hidden">
          {pluralize(questionCount, 'question')}
        </span>
        <span className="hidden sm:inline">{questionCount}</span>
      </Badge>
    </div>
  );
}
