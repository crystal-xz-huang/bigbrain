import {
  BannerGroup,
  CreateGameBanner,
  JoinGameBanner,
} from '@/components/ui/banners';
import WelcomeBanner from '@/components/admin/welcome-banner';
import { getUserOrNull } from '@/lib/data/auth';
import { SecondaryNavbar } from '@/components/ui/navigation/shell';
import {
  UserGames,
  RecentGames,
  PopularGames,
  CategoryGames,
} from '@/components/games/feeds';

export default async function HomePage() {
  const user = await getUserOrNull();

  return (
    <div className="px-4 max-md:px-0 w-full h-full">
      <SecondaryNavbar />
      <div className="flex flex-col space-y-8 w-full">
        {user && <WelcomeBanner />}

        <BannerGroup>
          <CreateGameBanner />
          <JoinGameBanner />
        </BannerGroup>

        {user && <UserGames />}
        <PopularGames />
        <RecentGames />
        <CategoryGames />
      </div>
    </div>
  );
}
