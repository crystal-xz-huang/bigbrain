/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccessError, InputError } from '@/lib/error';
import { NextResponse } from 'next/server';

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
