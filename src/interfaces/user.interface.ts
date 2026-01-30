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
