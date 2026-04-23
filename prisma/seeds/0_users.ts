import type { UserSeedTemplate, DB as Prisma } from '@/lib/definitions/types';
import { type User } from '@prisma/client';
import { admins } from '@prisma/seeds/data';
import bcrypt from 'bcrypt';

const generateUserData = async (user: UserSeedTemplate) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  return {
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    passwordHash: passwordHash,
  };
};

const seedUsers = async (prisma: Prisma): Promise<User[]> => {
  const start = Date.now();
  console.log('Seeding users...');

  const users = await Promise.all(
    admins.map(async (admin) => {
      const userData = await generateUserData(admin);
      return prisma.user.upsert({
        where: { email: admin.email },
        create: userData,
        update: {
          // keep password and email the same, but update other fields
          name: userData.name,
          username: userData.username,
          role: userData.role,
        },
      });
    })
  );

  const end = Date.now();
  console.log(`Seeding users completed in ${end - start}ms`);

  return users;
};

export default seedUsers;
