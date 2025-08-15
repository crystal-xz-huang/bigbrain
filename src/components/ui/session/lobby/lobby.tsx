'use client';

import { ButtonPrimary } from '@/components/ui/button';
import { HeadingOutlined } from '@/components/ui/heading';
import { LogoHeading } from '@/components/ui/logo';
import { PageContent } from '@/components/ui/page';
import ToggleGameLock from '@/components/ui/session/buttons/lock-game';
import PreviewGameLink from '@/components/ui/session/buttons/preview-game';
import StartGame from '@/components/ui/session/buttons/start-game';
import { Avatar } from '@/components/ui/session/lobby/avatar';
import { CopyLinkToClipboard } from '@/components/ui/session/lobby/buttons';
import {
  Card,
  CardContent,
  CardHeader,
  CardThumbnail,
} from '@/components/ui/session/lobby/card';
import { routes } from '@/lib/routes';
import type { AdminSession, PlayerSession } from '@/lib/types';
import { ordinalSuffix, pluralSuffix, splitString } from '@/lib/utils';
import { useState } from 'react';

export type Session = AdminSession | PlayerSession;

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
    <PageContent className="md:container flex flex-col lg:flex-row w-full h-full gap-8 pt-12 md:pt-20 mb:pb-8 pb-4 lg:px-8 px-4 lg:mx-auto lg:max-h-[60rem] font-sans">
      {/* Card with Header */}
      <Card className="flex-2 flex flex-col xl:w-4/6 lg:w-7/12">
        <CardHeader className="md:px-16 flex flex-col items-center justify-around gap-4 lg:flex-row lg:gap-0 lg:items-stretch">
          {/* Header goes here */}
          <div className="flex flex-col items-center justify-start gap-2">
            {session.locked ? (
              <div className="flex flex-col items-center justify-center flex-1 w-full text-base font-bold">
                <span>Game is locked -</span>
                <span>Joining is no longer avaliable</span>
              </div>
            ) : (
              <>
                <div className="text-base font-black text-center">Join at:</div>
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
            <div className="text-base text-center font-black">
              {isAdmin ? 'Game PIN:' : 'You have joined with PIN:'}
            </div>
            <div className="flex flex-row items-center justify-center flex-1 w-full">
              {session.locked ? (
                <div className="text-base font-bold text-center">
                  The code is hidden
                </div>
              ) : (
                <>
                  <svg
                    className="w-full h-auto"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 250 100"
                  >
                    <text
                      x="50%"
                      y="50%"
                      className="xl:text-6xl lg:text-5xl text-6xl font-black leading-none font-sans tracking-tight text-pink-pastel"
                      fill="currentColor"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      style={{
                        paintOrder: 'stroke',
                        stroke: 'rgb(0, 0, 0)',
                        strokeWidth: '0.166667em',
                        WebkitTextStroke: '0.166667em rgb(0, 0, 0)',
                      }}
                    >
                      {splitString(session.pin).join(' ')}
                    </text>
                  </svg>
                </>
              )}
            </div>
            <div className="flex flex-row items-center gap-4">
              <CopyLinkToClipboard href={routes.player.play(session.pin)} />
              {isAdmin && (
                <ToggleGameLock session={session} setSession={setSession} />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center w-full h-full">
          {/* Content goes here */}
          <div className="flex flex-col items-center gap-8 w-full h-full my-4">
            <section className="relative flex gap-2">
              {session.players.length > 0 ? (
                <HeadingOutlined className="!md:text-2xl !text-xl text-white">
                  {isAdmin ? (
                    <div>
                      {session.players.length} player
                      {pluralSuffix(session.players.length)} joined
                    </div>
                  ) : (
                    <div>
                      {ordinalSuffix(
                        session.players.findIndex((p) => p.id === userId) + 1
                      )}{' '}
                      player:
                    </div>
                  )}
                </HeadingOutlined>
              ) : (
                <HeadingOutlined className="!md:text-2xl !text-xl text-white">
                  <div className="flex flex-row items-end justify-center gap-1">
                    <span>Waiting for players</span>
                    <span className="loading loading-dots loading-sm text-black" />
                  </div>
                </HeadingOutlined>
              )}
            </section>

            <section className="grow w-full h-full">
              <div className="flex flex-row items-start justify-center gap-4 w-full h-full">
                {[session.host, ...session.players].map((player) => (
                  <Avatar
                    key={player.id}
                    player={player}
                    isHost={player.id === session.hostId}
                    isCurrentUser={player.id === userId}
                    isCurrentUserHost={session.hostId === userId}
                  />
                ))}
              </div>
            </section>

            <section className="flex flex-col items-center justify-center">
              {isAdmin ? (
                <StartGame
                  className="md:px-8 md:w-80 h-12 px-6 py-0"
                  sessionId={session.id}
                  setSession={setSession}
                >
                  Start game
                </StartGame>
              ) : (
                <ButtonPrimary color="blue" className="px-8 w-80 h-14" disabled>
                  <div className="flex items-end justify-center gap-1">
                    <span>Waiting for host to start</span>
                    <span className="loading loading-dots loading-sm" />
                  </div>
                </ButtonPrimary>
              )}
            </section>
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
              <p className="font-sans text-sm opacity-50 leading-tight">
                {session.questions.length} question
                {pluralSuffix(session.questions.length)}
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
