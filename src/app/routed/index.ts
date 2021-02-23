import { SSR_ENV } from '@/app/env';
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import HomePage from './home/home.vue';

export const router = createRouter( {
    history: ( SSR_ENV ? createMemoryHistory : createWebHistory )(),
    routes: [
        {
            component: HomePage,
            path: '/',
        },
    ],
} );
