import type {
  AuthStoreInterface,
  AuthUserInterface,
  SigninInterface,
  SignupInterface,
} from '../interfaces/user.interface';
import { useApi } from './useApi';

export abstract class AuthApi {
  /** SIGNUP **/

  static async signup(
    signupData: Omit<SignupInterface, 'confirmPassword'>,
  ): Promise<AuthUserInterface> {
    try {
      const { data } = await useApi().post(`/auth/signup`, signupData);
      return data;
    } catch (e: unknown) {
      throw e;
    }
  }

  /** SIGNIN **/

  static async signin(signinData: SigninInterface): Promise<AuthStoreInterface> {
    try {
      const { data } = await useApi().post(`/auth/signin`, signinData);
      return data;
    } catch (e: unknown) {
      throw e;
    }
  }

  /** LOGOUT **/

  static async logout(refreshToken: string) {
    try {
      await useApi().delete('auth/logout', {
        headers: { 'X-Refresh-Token': refreshToken },
      });
    } catch (e: unknown) {
      throw e;
    }
  }
}
