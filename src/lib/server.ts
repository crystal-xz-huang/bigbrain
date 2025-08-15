/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccessError, InputError } from '@/lib/error';
import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

/***************************************************************
                      Helper Functions
***************************************************************/

export function catchErrors<
  T extends (req: Request, context: any) => Promise<NextResponse>
>(handler: T) {
  return async (req: Request, context: any): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (err) {
      if (err instanceof InputError) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      } else if (err instanceof AccessError) {
        return NextResponse.json({ error: err.message }, { status: 403 });
      } else {
        console.log(err);
        return NextResponse.json(
          { error: 'A system error ocurred' },
          { status: 500 }
        );
      }
    }
  };
}



/***************************************************************
                      Avatars
***************************************************************/

export function getAvatarFiles(): string[] {
  // Return all files in the /public/avatars directory
  const dir = path.join(process.cwd(), 'public', 'avatars');
  const extensions = ['.svg', '.png'];
  return fs
    .readdirSync(dir)
    .filter((f) => extensions.includes(path.extname(f).toLowerCase()))
    .sort()
    .map(f => `/avatars/${f}`);
}

export function getRandomFile(list: string[], key?:string): string {
  if (list.length === 0) throw new Error('Empty list');
  if (!key) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  } else {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    const index = h % list.length;
    return list[index];
  }
}
