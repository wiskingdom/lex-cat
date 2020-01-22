<template>
  <div id="app">
    <q-layout view="hHh lpR fFf">
      <q-header bordered class="bg-grey-2 text-primary">
        <q-toolbar>
          <q-toolbar-title>사전 관리 도구</q-toolbar-title>
          <q-tabs
            align="left"
            indicator-color="grey-8"
            switch-indicator
            narrow-indicator
            active-color="grey-8"
            v-show="$auth.currentUser"
          >
            <q-route-tab
              name="main"
              class="text-bold text-grey-6"
              to="/main/"
              :label="'등재&분류 도구'"
            />
            <q-route-tab
              name="search"
              class="text-bold text-grey-6"
              to="/search/"
              :label="'검색 도구'"
            />
          </q-tabs>

          <q-space />
          <q-space />

          <div v-show="theCurrentUser.email">
            <q-icon :name="selectedMood" />
            {{ theCurrentUser.email }}
          </div>
          <q-btn
            color="primary"
            unelevated
            @click="logout"
            :label="logBTN"
            style="margin-left: 10px"
            v-show="$auth.currentUser"
          />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  computed: {
    ...mapState(['theCurrentUser', 'theTab']),
    selectedMood() {
      return [
        'mood',
        'mood_bad',
        'sentiment_dissatisfied',
        'sentiment_satisfied',
        'sentiment_very_dissatisfied',
        'sentiment_very_satisfied',
        'airline_seat_individual_suite',
      ].sort(() => Math.random() - 0.5)[0];
    },
    logBTN() {
      return this.theCurrentUser.email ? 'logout' : 'login';
    },
  },
  methods: {
    ...mapActions(['changeTheCurrentUser', 'pickTheTab']),
    logout() {
      if (this.$auth.currentUser) {
        this.$auth.signOut().then(() => {
          this.changeTheCurrentUser({});
          this.$router.push('/login');
        });
      }
    },
  },
};
</script>
