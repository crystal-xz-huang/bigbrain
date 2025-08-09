import CreateGameTrigger from '@/components/ui/games/triggers/create-game';
import {
  Banner,
  BannerAction,
  BannerContent,
  BannerDescription,
  BannerImage,
  BannerTitle,
} from '@/components/ui/banner';
import BannerIllustrationCreate from '@public/banner-illustration-create.svg';
import BannerIllustrationPlay from '@public/banner-illustration-play.svg';
import clsx from 'clsx';

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
        <BannerTitle className="text-neutral-content-strong">
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
    <Banner className="bg-primary-300">
      <BannerImage
        src={BannerIllustrationCreate}
        alt="Create Game Illustration"
      />
      <BannerContent>
        <BannerTitle className="text-primary-900">Create Game</BannerTitle>
        <BannerDescription className="text-primary-content/80">
          <div>Generate a game for free</div>
          <div>and play with participants</div>
        </BannerDescription>
        <CreateGameTrigger>
          <BannerAction type="button" color="pink">
            Game editor
          </BannerAction>
        </CreateGameTrigger>
      </BannerContent>
    </Banner>
  );
}
