import { fetchGamesFromAdmin } from '@/lib/data';
import { AccessError } from '@/lib/error';
import { catchErrors } from '@/lib/server';
import { getAuthUser } from '@/lib/service';
import { NextResponse } from 'next/server';

/***************************************************************
                      Game Functions
***************************************************************/

export const GET = catchErrors(async (req) => {
  const user = await getAuthUser();
  if (!user?.email) throw new AccessError('Unauthorized');
  const games = await fetchGamesFromAdmin(user);
  return NextResponse.json(games);
});
