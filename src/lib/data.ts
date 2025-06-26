import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Fetch a user by email and password hash from the database.
 *
 * @param {string} email - The user's email address.
 * @param {string} pwHash - The user's password hash.
 */
export async function fetchUser(email: string, pwHash: string) {
  return prisma.user.findFirst({
    where: {
      email,
      passwordHash: pwHash,
    }
  })
}