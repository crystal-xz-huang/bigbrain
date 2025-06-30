import type { User } from '@/lib/definitions';
import { sql } from '@/lib/neon';

export async function getUser(email: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users
      WHERE email = ${email}
    `;
    return users[0] as User; // Return the first user found or null if none exists
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
