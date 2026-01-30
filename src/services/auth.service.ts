import { AuthApi } from '@/api/auth.api';
import type {
  AuthStoreInterface,
  AuthUserInterface,
  SigninInterface,
  SignupInterface,
} from '../interfaces/user.interface';

export abstract class AuthService {
  /** SIGNUP **/

  static async signup(
    signupData: Omit<SignupInterface, 'confirmPassword'>,
  ): Promise<AuthUserInterface> {
    return await AuthApi.signup(signupData);
  }

  /** SIGNIN **/

  static async signin(signinData: SigninInterface): Promise<AuthStoreInterface> {
    return await AuthApi.signin(signinData);
  }
}
