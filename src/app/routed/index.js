import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './home/home';


export const router = createRouter( {
    history: createWebHistory(),
    routes: [
        {
            component: HomePage,
            path: '/',
        },
    ],
} );
