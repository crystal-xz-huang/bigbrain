import { ClockIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { Badge } from '@/components/ui/badge';
import { getNumberOfQuestions, getTotalDuration } from '@/lib/utils';
import type { Question } from '@prisma/client';

export default function GameCardMetadata({ questions } : {
  questions: Question[];
}) {
  return (
    <div className="flex flex-row items-center flex-shrink-0 space-x-3">
      <Badge color="indigo" className="flex flex-shrink-0">
        <ClockIcon aria-hidden="true" className="size-4" />
        {getTotalDuration(questions)}
      </Badge>
      <Badge color="fuchsia" className="flex flex-shrink-0">
        <QuestionMarkCircleIcon aria-hidden="true" className="size-4" />
        {getNumberOfQuestions(questions)}
      </Badge>
    </div>
  );
}