export interface SignupInterface {
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
}

export interface SigninInterface {
  email: string | null;
  password: string | null;
}

export interface AuthUserInterface {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export interface AuthStoreInterface {
  user: AuthUserInterface | null;
  accessToken: string | null;
  refreshToken: string | null;
}
