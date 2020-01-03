import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './quasar';
import fireapp from './fireapp';

Vue.config.productionTip = false;

let app = '';

Vue.prototype.$auth = fireapp.auth();
Vue.prototype.$db = fireapp.database();

fireapp.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app');
  }
});
