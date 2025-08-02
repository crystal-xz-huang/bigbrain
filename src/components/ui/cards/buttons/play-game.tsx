import { Button } from '@/components/ui/styled/button';

export default function PlayGame({ gameId }: { gameId: string }) {
  return (
    <Button color="green" className="!text-base w-32 h-14">
      <span className="md:inline hidden">Play Now</span>
      <span className="md:hidden inline">Play</span>
    </Button>
  );
}
