import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Game, Questions } from '@/components/ui/cards/view-game';
import { Container } from '@/components/ui/page';
import { fetchGameById } from '@/lib/data';
import { routes } from '@/lib/routes';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  // Read the game ID from the URL parameters
  const params = await props.params;
  const id = params.id;

  // Fetch the game details using the ID
  const game = await fetchGameById(id);
  if (!game) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs gameName={game.name} />
      <Container>
        <div className="flex flex-col w-full h-full">
          <Game game={game} />
          <Questions questions={game.questions} />
        </div>
      </Container>
    </>
  );
}

function Breadcrumbs({ gameName }: { gameName: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={routes.dashboard}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={routes.games}>Games</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{gameName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
