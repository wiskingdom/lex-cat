import Vue from "vue";
import Vuex from "vuex";
import state from "./00.state";
import * as getters from "./01.getters";
import * as mutations from "./02.mutations";
import * as actions from "./03.actions";

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});
