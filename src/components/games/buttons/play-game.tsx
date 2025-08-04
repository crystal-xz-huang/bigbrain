import { ButtonPrimary } from '@/components/ui/button';

export default function PlayGame({ gameId }: { gameId: string }) {
  return (
    <ButtonPrimary color="green" className="!text-base w-32 h-14">
      <span className="md:inline hidden">Play Now</span>
      <span className="md:hidden inline">Play</span>
    </ButtonPrimary>
  );
}
