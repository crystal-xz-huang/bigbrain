'use client';

import AddQuestion from '@/components/games/buttons/add-question';
import { Subheading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { SquaresPlusIcon } from '@heroicons/react/24/outline';

export default function EmptyState({ gameId }: { gameId: string }) {
  return (
    <div className="text-center mt-10">
      <SquaresPlusIcon className="mx-auto size-12" />
      <Subheading level={3} className="mt-2">
        No questions added
      </Subheading>
      <Text className="mt-1">Get started by creating a new question</Text>
      <div className="mt-6">
        <AddQuestion gameId={gameId} />
      </div>
    </div>
  );
}