<script lang="ts">
import ButtonCustom from '@/components/inputs/ButtonCustom.vue';
import Title from '@/components/shared/Title.vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    function goToSignup() {
      router.push('/signup');
    }

    function goToSignin() {
      router.push('/signin');
    }
    return {
      goToSignup,
      goToSignin,
    };
  },
  components: {
    Title,
    ButtonCustom,
  },
};
</script>

<template>
  <article class="min-h-screen flex flex-col gap-6">
    <Title
      content="La météo du monde"
      subTitle="Explorez les prévisions météorologiques de n'importe où dans le monde"
    />

    <aside class="flex flex-col items-center justify-center gap-6 text-center">
      <section class="flex flex-row gap-4 w-full justify-center items-center">
        <ButtonCustom @click="goToSignin" content="Se connecter" />
        <ButtonCustom @click="goToSignup" content="Créer un compte" />
      </section>
    </aside>
  </article>
</template>
