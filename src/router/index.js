import Vue from 'vue';
import VueRouter from 'vue-router';
import fireapp from '@/fireapp';
import Login from '../views/Login.vue';
import MainLayout from '../layouts/MainLayout.vue';
import MainAbout from '../views/MainAbout.vue';
import MainEntry from '../views/MainEntry.vue';

const SesLayout = () => import('../layouts/SesLayout.vue');
const Domain = () => import('../views/Domain.vue');
const Synset = () => import('../views/Synset.vue');

// const db = fireapp.database();
const auth = fireapp.auth();

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    redirect: '/main',
  },
  {
    path: '/',
    redirect: '/main',
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/main',
    component: MainLayout,
    beforeEnter: (to, from, next) => {
      if (auth.currentUser) {
        next();
      } else {
        next('/login');
      }
    },
    children: [
      {
        path: '/',
        redirect: 'about',
      },
      {
        path: 'about',
        name: 'about',
        component: MainAbout,
      },
      {
        path: ':entryId',
        name: 'entry',
        component: MainEntry,
      },
    ],
  },
  {
    path: '/ses',
    name: 'ses',
    component: SesLayout,
    beforeEnter: (to, from, next) => {
      if (auth.currentUser) {
        next();
      } else {
        next('/login');
      }
    },
    children: [
      {
        path: ':domainId',
        name: 'domain',
        component: Domain,
        children: [
          {
            path: 'about',
            name: 'sesAbout',
            component: MainAbout,
          },
          {
            path: ':synsetId',
            name: 'synset',
            component: Synset,
          },
        ],
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
