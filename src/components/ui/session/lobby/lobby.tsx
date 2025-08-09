'use client';

import { ButtonPrimary } from '@/components/ui/button';
import { HeadingOutlined } from '@/components/ui/heading';
import { LogoHeading } from '@/components/ui/logo';
import { PageContent } from '@/components/ui/page';
import { CopyLinkToClipboard } from '@/components/ui/session/lobby/buttons';
import {
  Card,
  CardContent,
  CardHeader,
  CardThumbnail,
} from '@/components/ui/session/lobby/card';
import { routes } from '@/lib/routes';
import type { Session } from '@/lib/types';
import { pluralSuffix, splitString } from '@/lib/utils';
import { useState } from 'react';

import ToggleGameLock from '@/components/ui/session/buttons/lock-game';
import PreviewGameLink from '@/components/ui/session/buttons/preview-game';
import StartGame from '@/components/ui/session/buttons/start-game';

export default function Lobby({
  gameSession,
  userId,
}: {
  gameSession: Session;
  userId: string;
}) {
  const [session, setSession] = useState<Session>(gameSession);
  const isAdmin = userId === gameSession.hostId;

  return (
    <PageContent className="md:container flex flex-col lg:flex-row w-full h-full gap-8 pt-12 md:pt-20 mb:pb-8 pb-4 lg:px-8 px-4 lg:mx-auto lg:max-h-[60rem]">
      {/* Card with Header */}
      <Card className="flex-2 flex flex-col xl:w-4/6 lg:w-7/12">
        <CardHeader className="md:px-16 flex flex-col items-center justify-around gap-4 lg:flex-row lg:gap-0 lg:items-stretch">
          {/* Header goes here */}
          <div className="flex flex-col items-center justify-start gap-2">
            {session.locked ? (
              <div className="flex flex-col items-center justify-center flex-1 w-full text-base font-bold text-white">
                <span>Game is locked -</span>
                <span>Joining is no longer avaliable</span>
              </div>
            ) : (
              <>
                <div className="text-base font-bold text-center">Join at:</div>
                <div className="flex items-center justify-center flex-1 w-full">
                  <div className="flex flex-row items-baseline lg:flex-col lg:items-center ">
                    <LogoHeading className="relative z-10" />
                    <HeadingOutlined className="relative -mt-[21px] z-0 text-base-100 tracking-normal">
                      .com
                    </HeadingOutlined>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col items-center justify-start gap-2">
            <div className="text-base font-bold text-center">Game PIN:</div>
            <div className="flex flex-row items-center justify-center flex-1 w-full">
              {session.locked ? (
                <div className="text-base font-bold text-center">
                  The code is hidden
                </div>
              ) : (
                <HeadingOutlined className="text-primary-300">
                  <div className="flex flex-row items-center justify-center flex-1 gap-4">
                    {splitString(session.pin).map((part, index) => (
                      <div key={index}>{part}</div>
                    ))}
                  </div>
                </HeadingOutlined>
              )}
            </div>
            <div className="flex flex-row items-center gap-4">
              <CopyLinkToClipboard href={routes.session.join(session.pin)} />
              {isAdmin && (
                <ToggleGameLock session={session} setSession={setSession} />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center">
          {/* Content goes here */}
          <div className="flex flex-col items-center gap-6 w-full my-8">
            <div className="relative flex gap-2">
              {session.players.length > 0 ? (
                <HeadingOutlined className="!md:text-2xl !text-xl">
                  {isAdmin ? (
                    <div>
                      {session.players.length} player
                      {pluralSuffix(session.players.length)} joined
                    </div>
                  ) : (
                    <div>
                      {session.players.findIndex(
                        (player) => player.id === userId
                      ) + 1}{' '}
                      of {session.players.length} players
                    </div>
                  )}
                </HeadingOutlined>
              ) : (
                <HeadingOutlined className="!md:text-2xl !text-xl">
                  Waiting for players
                </HeadingOutlined>
              )}
              <div className="loading loading-dots loading-lg" />
            </div>
            <div className="flex flex-col items-center justify-center">
              {isAdmin ? (
                <StartGame
                  className="md:px-8 md:w-80 h-12 px-6 py-0"
                  sessionId={session.id}
                  setSession={setSession}
                >
                  Start game
                </StartGame>
              ) : (
                <ButtonPrimary
                  className="md:px-8 md:w-80 h-12 px-6 py-0"
                  disabled
                >
                  Waiting for host to start
                  <div className="loading loading-dots loading-lg" />
                </ButtonPrimary>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 xl:w-2/6 lg:w-5/12">
        <CardHeader className="flex flex-col items-start justify-start flex-1 gap-4">
          {/* Header goes here */}
          <CardThumbnail
            src={null}
            alt="Game Thumbnail"
            className="flex-1 shrink-0 min-w-30"
          />
          <div className="flex flex-col items-start justify-center w-full">
            <div className="flex flex-row items-center justify-start w-full gap-4">
              <p className="font-sans text-sm text-white opacity-50 leading-tight">
                {session.questions.length} questions
              </p>
              {isAdmin && <PreviewGameLink />}
            </div>
          </div>
        </CardHeader>
        <CardContent>{/* Content goes here */}</CardContent>
      </Card>
    </PageContent>
  );
}
