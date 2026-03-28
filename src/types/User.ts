export interface User {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface TestUsers {
  customer: User;
  admin: User;
}
