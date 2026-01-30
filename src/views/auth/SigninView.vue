<script lang="ts">
import { useToast } from 'vue-toastification';
import Title from '../../components/shared/Title.vue';
import Card from '../../components/shared/Card.vue';
import Row from '../../components/shared/Row.vue';
import InputText from '../../components/inputs/InputText.vue';
import { reactive } from 'vue';
import type { AuthStoreInterface, SigninInterface } from '../../interfaces/user.interface';
import { withMessage } from '../../utils/helpers/withMessage';
import { email, minLength, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { AxiosError } from 'axios';
import ButtonSubmit from '../../components/inputs/ButtonSubmit.vue';
import { useRouter } from 'vue-router';
import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';

export default {
  setup() {
    const toast = useToast();
    const router = useRouter();
    const authStore = useAuthStore();

    // FORM
    const signinForm = reactive<SigninInterface>({
      email: null,
      password: null,
    });
    const rules = {
      email: {
        required: withMessage("L'email est requis", required),
        email: withMessage("L'email n'est pas au bon format", email),
      },
      password: {
        required: withMessage('Le mot de passe est requis', required),
        minLength: withMessage('Le mot de passe doit faire au moins 6 caractères', minLength(6)),
      },
    };
    const v$ = useVuelidate(rules, signinForm);

    // SIGNIN
    async function signin() {
      const isValid = await v$.value.$validate();
      if (!isValid) return;

      try {
        const response: AuthStoreInterface = await AuthService.signin(signinForm);

        authStore.setAuthState(response);
        router.push('/forecast');
      } catch (e: unknown) {
        if (e instanceof AxiosError && e.response) {
          switch (e.response.status) {
            case 401:
              toast.error('Identifiants invalides');
              break;
            default:
              toast.error('Erreur serveur');
          }
        } else {
          toast.error('Une erreur est survenue');
        }
      }
    }

    // NAV
    function goToSignup() {
      router.push('/signup');
    }

    return {
      signinForm,
      v$,
      toast,
      signin,
      goToSignup,
    };
  },
  components: {
    Title,
    Card,
    Row,
    InputText,
    ButtonSubmit,
  },
};
</script>

<template>
  <article class="min-h-screen flex flex-col gap-6">
    <Title content="Se connecter" />

    <Card width="w-1/2 mx-auto" height="h-full">
      <aside class="flex flex-col gap-4 w-full">
        <section>
          <InputText
            v-model="signinForm.email"
            :isRequired="true"
            name="email"
            label="Email"
            placeholder="Email"
            :displayLabel="true"
            :validation="v$.email"
          />
        </section>
        <section>
          <InputText
            v-model="signinForm.password"
            :isRequired="true"
            name="password"
            label="Mot de passe"
            placeholder="Mot de passe"
            :displayLabel="true"
            :isPassword="true"
            :validation="v$.password"
          />
        </section>
        <Row>
          <template #right>
            <ButtonSubmit @click="signin" content="Se connecter" />
          </template>
        </Row>
      </aside>
    </Card>
    <section class="pl-1 w-1/2 mx-auto">
      <small
        >Pas de compte? Créez en un
        <a @click="goToSignup" class="cursor-pointer text-blue-500">ici</a></small
      >
    </section>
  </article>
</template>
