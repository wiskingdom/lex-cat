import Vue from 'vue';
import VueRouter from 'vue-router';
import fireapp from '@/fireapp';
import Login from '../views/Login.vue';
import MainLayout from '../layouts/MainLayout.vue';
import MainAbout from '../views/MainAbout.vue';
import MainEntry from '../views/MainEntry.vue';

const IssueLayout = () => import('../layouts/IssueLayout.vue');

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
    path: '/issue',
    name: 'issue',
    component: IssueLayout,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
