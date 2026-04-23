import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  GoBackButton,
  GoForwardButton,
} from '@/components/ui/navigation/buttons';
import { Container, PageContent } from '@/components/ui/page';
import { getGameViewDTO } from '@/lib/data/game-dto';
import { GameViewType } from '@/lib/definitions/constants';
import { routes } from '@/lib/routes';
import ViewGameDetails from './_components/game';
import ViewQuestions from './_components/questions';

export default async function ViewGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Read the game ID from the URL parameters
  const gameId = (await params).id;
  // Fetch the game details using the ID
  const game = await getGameViewDTO(gameId);

  return (
    <PageContent>
      {game.type === GameViewType.PROTECTED ? (
        <Breadcrumbs gameName={game.name} />
      ) : (
        <div className="w-full flex justify-between">
          <GoBackButton outline />
          <GoForwardButton outline />
        </div>
      )}
      <Container>
        <ViewGameDetails game={game} />
        <ViewQuestions game={game} />
      </Container>
    </PageContent>
  );
}

function Breadcrumbs({ gameName }: { gameName: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={routes.user.library}>Library</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{gameName}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
