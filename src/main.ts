import './assets/main.css';

import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

/** STORE **/
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';

/** TOAST **/
import Toast, { POSITION, type PluginOptions } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const options: PluginOptions = {
  position: POSITION.TOP_CENTER,
};
const pinia = createPinia();
pinia.use(piniaPersist);

const app = createApp(App);
app.use(pinia);
app.use(Toast, options);
app.use(router);

app.mount('#app');
