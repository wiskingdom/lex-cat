import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import MainLayout from '../layouts/MainLayout.vue';
//import MainAbout from '../views/MainAbout.vue';
import EntryLayout from '../layouts/EntryLayout.vue';
//import fireapp from '@/fireapp';
// const db = fireapp.database();
//const auth = fireapp.auth();

Vue.use(VueRouter);

const routes = [
  {
    path: '*',
    redirect: '/login',
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/main',
    name: 'main',
    component: MainLayout,
    children: [
      {
        path: ':entryId',
        component: EntryLayout,
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
