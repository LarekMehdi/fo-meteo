<script lang="ts">
import useVuelidate from '@vuelidate/core';
import InputText from '../../components/inputs/InputText.vue';
import Title from '../../components/shared/Title.vue';
import type { SignupInterface } from '../../interfaces/user.interface';
import { computed, reactive } from 'vue';
import { email, helpers, maxLength, minLength, required, sameAs } from '@vuelidate/validators';
import Row from '../../components/shared/Row.vue';
import ButtonSubmit from '../../components/inputs/ButtonSubmit.vue';
import { withMessage } from '../../utils/helpers/withMessage';
import Card from '../../components/shared/Card.vue';
import { AxiosError } from 'axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { AuthService } from '@/services/auth.service';

export default {
  setup() {
    const toast = useToast();
    const router = useRouter();
    const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{6,}$/;

    const passwordRef = computed(() => signupForm.password);

    const signupForm = reactive<SignupInterface>({
      firstname: null,
      lastname: null,
      email: null,
      password: null,
      confirmPassword: null,
    });
    const rules = {
      firstname: {
        required: withMessage('Le prénom est requis', required),
        minLength: withMessage('Le prénom doit faire au moins 2 caractères', minLength(2)),
        maxLength: withMessage('Le prénom ne peut pas dépasser 50 caractères', maxLength(50)),
      },
      lastname: {
        required: withMessage('Le nom est requis', required),
        minLength: withMessage('Le nom doit faire au moins 2 caractères', minLength(2)),
        maxLength: withMessage('Le nom ne peut pas dépasser 50 caractères', maxLength(50)),
      },
      email: {
        required: withMessage("L'email est requis", required),
        email: withMessage("L'email n'est pas au bon format", email),
        maxLength: withMessage("L'email ne peut pas dépasser 200 caractères", maxLength(200)),
      },
      password: {
        required: withMessage('Le mot de passe est requis', required),
        strongPassword: withMessage(
          'Le mot de passe doit contenir au moins 6 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
          helpers.regex(REGEX_PASSWORD),
        ),
      },
      confirmPassword: {
        required: withMessage('La confirmation du mot de passe est requise', required),
        sameAsPassword: withMessage('Les mots de passe ne correspondent pas', sameAs(passwordRef)),
      },
    };
    const v$ = useVuelidate(rules, signupForm);

    async function signup() {
      const isValid = await v$.value.$validate();
      if (!isValid) return;

      try {
        const { confirmPassword, ...payload } = signupForm;
        await AuthService.signup(payload);
        router.push('/signin');
        toast.success('Compte créé avec succés');
      } catch (e: unknown) {
        if (e instanceof AxiosError && e.response) {
          switch (e.response.status) {
            case 409:
              toast.error('Ce mail existe déjà');
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
    function goToSignin() {
      router.push('/signin');
    }

    return {
      v$,
      toast,
      signupForm,
      signup,
      goToSignin,
    };
  },
  components: {
    Title,
    InputText,
    Row,
    ButtonSubmit,
    Card,
  },
};
</script>

<template>
  <article class="min-h-screen flex flex-col gap-6">
    <Title content="Créer un compte" />

    <Card width="w-1/2 mx-auto" height="h-full">
      <aside class="flex flex-col gap-4 w-full">
        <section>
          <InputText
            v-model="signupForm.firstname"
            :isRequired="true"
            name="firstname"
            label="Prénom"
            placeholder="Prénom"
            :displayLabel="true"
            :validation="v$.firstname"
          />
        </section>
        <section>
          <InputText
            v-model="signupForm.lastname"
            :isRequired="true"
            name="lastname"
            label="Nom"
            placeholder="Nom"
            :displayLabel="true"
            :validation="v$.lastname"
          />
        </section>
        <section>
          <InputText
            v-model="signupForm.email"
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
            v-model="signupForm.password"
            :isRequired="true"
            name="password"
            label="Mot de passe"
            placeholder="Mot de passe"
            :displayLabel="true"
            :isPassword="true"
            :validation="v$.password"
          />
        </section>
        <section>
          <InputText
            v-model="signupForm.confirmPassword"
            :isRequired="true"
            name="confirmPassword"
            label="Retaper le mot de passe"
            placeholder="Retaper le mot de passe"
            :displayLabel="true"
            :isPassword="true"
            :validation="v$.confirmPassword"
          />
        </section>
        <Row>
          <template #right>
            <ButtonSubmit @click="signup" content="Créer un compte" />
          </template>
        </Row>
      </aside>
    </Card>
    <section class="pl-1 w-1/2 mx-auto">
      <small>
        Déjà un compte? Connectez vous
        <a @click="goToSignin" class="cursor-pointer text-blue-500">ici</a>
      </small>
    </section>
  </article>
</template>
