import { createRouter, createWebHistory } from 'vue-router';
import ContactPage from './contact/contact';
import HomePage from './home/home';


export const router = createRouter( {
    history: createWebHistory(),
    routes: [
        {
            component: HomePage,
            path: '/',
        },
        {
            component: ContactPage,
            path: '/contact',
        },
    ],
} );
