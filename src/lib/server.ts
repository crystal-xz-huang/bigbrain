import { AccessError, InputError } from '@/lib/error';
import { NextRequest, NextResponse } from 'next/server';

/***************************************************************
                      Helper Functions
***************************************************************/

export function catchErrors(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req);
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
                      Game Functions
***************************************************************/
