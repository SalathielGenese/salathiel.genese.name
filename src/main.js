import { router } from '@/app/routed';
import { createApp } from 'vue';
import './assets/tailwind.css';
import App from './app.vue';

createApp( App )
    .use( router )
    .mount( 'main' );
