import { SSR_ENV } from '@/app/env';
import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router';
import HomePage from '../../routed/home/home.vue';
import NotFoundPage from '../../routed/not-found/not-found.vue';

export const router = createRouter( {
    history: ( SSR_ENV ? createMemoryHistory : createWebHistory )(),
    routes: [
        {
            component: HomePage,
            path: '/',
        },
        {
            component: NotFoundPage,
            path: '/:pathMatch(.*)*',
        },
    ],
} );
