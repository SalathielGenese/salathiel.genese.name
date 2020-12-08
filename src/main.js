import 'remixicon/fonts/remixicon.css';
import { router } from '@/app/routed';
import { createApp } from 'vue';
import './assets/tailwind.css';
import App from './app.vue';
import { VuelidatePlugin } from '@vuelidate/core';

createApp( App )
    .use( router )
    .use( VuelidatePlugin )
    .mount( 'main' );
