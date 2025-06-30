export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // don't store plain text passwords
  createdAt?: Date;
  updatedAt?: Date;
  emailVerified?: Date | null;
  image?: string | null;
}

// User without passwordHash for authenticated requests
export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  emailVerified?: Date | null;
  image?: string | null;
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}
