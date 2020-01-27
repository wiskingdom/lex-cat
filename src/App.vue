<template>
  <div id="app">
    <q-layout view="hHh lpR fFf">
      <q-header bordered class="bg-grey-2 text-primary">
        <q-toolbar>
          <q-toolbar-title>사전 관리 도구</q-toolbar-title>
          <q-tabs
            align="left"
            indicator-color="grey-8"
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
              name="issue"
              class="text-bold text-grey-6"
              to="/issue/"
              :label="'이슈 처리 도구'"
              v-show="userContext.role === 'supervisor'"
            />
          </q-tabs>

          <q-space />

          <div v-show="$auth.currentUser">
            <q-icon :name="selectedMood" />
            {{ theCurrentUser.email }}
          </div>
          <q-btn
            color="primary"
            unelevated
            @click="logout"
            label="logout"
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
    ...mapState(['theCurrentUser', 'userContext']),
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
  },
  methods: {
    ...mapActions([
      'changeTheCurrentUser',
      'pickTheUserId',
      'fetchUserContext',
      'initUserContext',
      'pickTheDomain',
      'pickTheWorksetId',
      'initEntryMarkings',
    ]),
    logout() {
      if (this.$auth.currentUser) {
        this.$auth.signOut().then(() => {
          this.changeTheCurrentUser(this.$auth.currentUser);
          this.initUserContext();
          this.$router.push('/login');
        });
      }
    },
  },
  created() {
    if (this.$auth.currentUser) {
      this.changeTheCurrentUser(this.$auth.currentUser);
      this.pickTheUserId(this.$auth.currentUser.email);
      this.fetchUserContext();
    }
  },
};
</script>
