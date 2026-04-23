import { ButtonPrimary } from '@/components/ui/button';
import { routes } from '@/lib/routes';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function DeleteGameButton({ gameId }: { gameId: string }) {
  return (
    <div className="flex flex-row items-center gap-4">
      <ButtonPrimary
        type="button"
        rounded={false}
        className="w-12 h-12 p-0 text-white"
        color="error"
        href={routes.game.delete(gameId)}
        title="Delete game"
      >
        <TrashIcon className="size-6 text-white stroke-2" />
      </ButtonPrimary>
      <span className="flex flex-row items-center justify-center gap-2 max-sm:hidden">
        <ArrowLeftIcon className="size-5 text-zinc-950 dark:text-white stroke-5" />
        <div className="pl-2 text-xl font-bold text-zinc-950 dark:text-white">Delete game</div>
      </span>
    </div>
  );
}
