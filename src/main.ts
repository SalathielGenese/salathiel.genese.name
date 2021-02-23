import { SSR_ENV } from '@/app/env';
import { router } from '@/app/routed';
import { VuelidatePlugin } from '@vuelidate/core';
import 'remixicon/fonts/remixicon.css';
import { createApp, createSSRApp } from 'vue';
import App from './app.vue';
import './assets/tailwind.css';

const app = ( SSR_ENV ? createSSRApp : createApp )( App )
    .use( router )
    .use( VuelidatePlugin );

SSR_ENV || ( async () => {
    await router.isReady();
    app.mount( 'main', true );
} )();

export default app;
