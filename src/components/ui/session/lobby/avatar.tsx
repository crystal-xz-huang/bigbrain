import { HostIcon } from '@/components/ui/icon';
import clsx from 'clsx';
import Image from 'next/image';
import type { Player, User } from '@prisma/client';
import { UserIcon } from '@heroicons/react/20/solid';

export function Avatar({
  player,
  isHost,
  isCurrentUser,
  isCurrentUserHost,
}: {
  player: Player | User;
  isHost: boolean;
  isCurrentUser: boolean;
  isCurrentUserHost?: boolean;
}) {
  return (
    <>
      {/* Avatar Wrapper */}
      <div className="size-32 relative group">
        <div className="top-2 left-2 right-2 bottom-2 absolute">
          <div className="relative size-full">
            <div className="pb-[100%] relative w-full">
              <div className="absolute size-full">
                {/* >>> Border <<< */}
                <div
                  className={clsx(
                    'relative size-full transition-opacity rounded-full bg-black p-[4%]',
                    isHost && 'border-2 md:border-4 border-gold'
                  )}
                >
                  {/* >>> Inner Circle with Image <<< */}
                  <div className="relative size-full overflow-hidden rounded-full">
                    <div className="absolute block -left-[2px] -top-[2px] w-[calc(100%+4px)] h-[calc(100%+4px)] bg-navy">
                      <div className="pb-[100%] relative w-full bg-navy">
                        {player.image ? (
                          <Image
                            className="absolute top-0 left-0 size-full scale-105"
                            src={player.image}
                            alt={`${player.name}'s avatar`}
                            width={100}
                            height={100}
                          />
                        ) : (
                          <UserIcon className="absolute top-0 left-0 size-full text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                  {/* >>> Name overlay <<< */}
                  <svg
                    className="absolute inset-0 pointer-events-none -top-1"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <defs>
                      <path
                        id={`arc-${player.id}`}
                        d="M 10 50 A 40 40 0 0 1 90 50"
                      />
                    </defs>
                    <text
                      className="font-sans tracking-tight"
                      fontSize="14"
                      fontWeight="900"
                      fill="white"
                      style={{
                        paintOrder: 'stroke',
                        stroke: 'black',
                        strokeWidth: 2,
                      }}
                    >
                      <textPath
                        href={`#arc-${player.id}`}
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        {(player.name ?? 'Player').slice(0, 25)}
                      </textPath>
                    </text>
                  </svg>

                  {/* Host Icon */}
                  {isHost && (
                    <HostIcon className="left-1/2 -bottom-[5%] absolute w-[55%] transform -translate-x-1/2" />
                  )}
                </div>
                {!isCurrentUser && (
                  <div className="absolute top-0 left-0 size-full">
                    <div className="absolute bottom-0 right-0 w-[30%] pb-[30%] md:w-6 md:pb-6 lg:w-7 lg:pb-7">
                      <div className="absolute top-0 left-0">
                        <div className="relative p-0.5 overflow-hidden bg-black rounded-full transition-transform transform">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 22 22"
                            className="size-full"
                            style={{
                              fill: 'rgb(0, 167, 109)',
                              color: 'rgb(255, 250, 230)',
                            }}
                          >
                            <circle cx={11} cy={11} r={11} />
                            <path
                              d="m11 15.59 5.18-8a3.72 3.72 0 0 0 .21-.39 1.15 1.15 0 0 0 .08-.41.91.91 0 0 0-.34-.74 1.22 1.22 0 0 0-.77-.28 1.11 1.11 0 0 0-.94.61L9.86 13.6 7.76 11a1.45 1.45 0 0 0-.43-.39 1.08 1.08 0 0 0-.5-.12 1 1 0 0 0-.75.32 1 1 0 0 0-.31.76 1.25 1.25 0 0 0 .31.82l2.69 3.27a1.66 1.66 0 0 0 .51.44 1.31 1.31 0 0 0 .61.15 1.23 1.23 0 0 0 1.11-.66Z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Tooltip on hover */}
              {isCurrentUserHost && !isHost && (
                <div className="absolute bottom-0 left-1/2 hidden group-hover:block">
                  <div className="left-1/2 absolute">
                    <div className="size-3 rotate-45 -translate-x-1/2 translate-y-1 bg-black" />
                    <div className="whitespace-nowrap px-3 py-1 text-white -translate-x-1/2 -translate-y-1 bg-black rounded-md">
                      <button className="hover:underline font-white font-sans font-extrabold text-sm/6 cursor-pointer">
                        Kick player
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
