import {
  Banner,
  BannerAction,
  BannerContent,
  BannerDescription,
  BannerImage,
  BannerTitle,
} from '@/components/ui/banners/banner';
import BannerIllustrationCreate from '@public/banner-illustration-create.svg';
import BannerIllustrationPlay from '@public/banner-illustration-play.svg';
import clsx from 'clsx';
import { routes } from '@/lib/routes';

export function BannerGroup({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(className, 'md:flex-row flex flex-col gap-4')}
      {...props}
    />
  );
}

export function StartGameBanner() {
  return (
    <Banner className="bg-neutral">
      <BannerImage src={BannerIllustrationPlay} alt="Start Game Illustration" />
      <BannerContent className="text-white">
        <BannerTitle>Start Game</BannerTitle>
        <BannerDescription>
          Host a game and invite participants
        </BannerDescription>
        <BannerAction type="button" color="orange">
          Start game session
        </BannerAction>
      </BannerContent>
    </Banner>
  );
}

export function JoinGameBanner() {
  return (
    <Banner className="bg-neutral">
      <BannerImage src={BannerIllustrationPlay} alt="Join Game Illustration" />
      <BannerContent>
        <BannerTitle className="text-white">
          Join Game
        </BannerTitle>
        <BannerDescription className="text-neutral-content">
          <div>Enter a game code</div>
          <div>to join a live session</div>
        </BannerDescription>
        <BannerAction type="button" color="cyan">
          Join game
        </BannerAction>
      </BannerContent>
    </Banner>
  );
}

export function CreateGameBanner() {
  return (
    <Banner className="bg-secondary">
      <BannerImage
        src={BannerIllustrationCreate}
        alt="Create Game Illustration"
      />
      <BannerContent>
        <BannerTitle className="text-white">Create Game</BannerTitle>
        <BannerDescription className="text-primary-content">
          <div>Generate a game for free</div>
          <div>from any category</div>
        </BannerDescription>
        <BannerAction type="button" color="pink" href={routes.game.create}>
          Game editor
        </BannerAction>
      </BannerContent>
    </Banner>
  );
}
