import { createRouter, createWebHistory } from 'vue-router';
import PortfolioPage from './portfolio/portfolio';
import ContactPage from './contact/contact';
import CareerPage from './career/career';
import TrailPage from './trail/trail';
import HomePage from './home/home';


export const router = createRouter( {
    history: createWebHistory(),
    routes: [
        {
            component: HomePage,
            path: '/',
        },
        {
            component: TrailPage,
            path: '/trail',
        },
        {
            component: CareerPage,
            path: '/career',
        },
        {
            component: PortfolioPage,
            path: '/portfolio',
        },
        {
            component: ContactPage,
            path: '/contact',
        },
    ],
} );
