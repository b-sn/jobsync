export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  locale: string;
}

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  locale?: string;
  iat?: number;
  exp?: number;
};
