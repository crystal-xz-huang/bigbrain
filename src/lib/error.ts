export class InputError extends Error {
  constructor (message: string) {
    super(message);
    this.name = 'InputError';
  }
}

export class AccessError extends Error {
  constructor (message: string) {
    super(message);
    this.name = 'AccessError';
  }
}

export class DatabaseError extends Error {
  constructor (message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}