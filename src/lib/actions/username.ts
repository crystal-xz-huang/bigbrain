'use server';

import type { UpdateUsernameActionResponse } from '@/lib/definitions/types';
import { prisma } from '@/lib/prisma';
import { UpdateUsernameSchema } from '@/lib/zod';
import * as z from 'zod';

export async function updateUsernameAction(
  userId: string,
  _prevState: UpdateUsernameActionResponse | null,
  formData: FormData
): Promise<UpdateUsernameActionResponse> {
  const data = Object.fromEntries(formData);
  const parsed = await UpdateUsernameSchema.safeParseAsync(data);
  if (!parsed.success) {
    return {
      success: false,
      message: 'Please fix the errors in the form.',
      errors: z.flattenError(parsed.error).fieldErrors,
      inputs: data,
    };
  }
  await prisma.user.update({
    where: { id: userId },
    data: { username: parsed.data.username },
  });
  return {
    success: true,
    message: `Username updated to @${parsed.data.username}`,
    username: parsed.data.username,
  };
}
