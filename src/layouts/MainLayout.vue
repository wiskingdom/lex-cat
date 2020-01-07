<template>
  <q-layout view="HHh Lpr lFf">
    <q-header bordered class="bg-grey-2 text-primary">
      <q-toolbar>
        <q-toolbar-title>사전 관리 도구</q-toolbar-title>

        <div v-show="currentUserEmail">
          <q-icon :name="selectedMood" />
          {{ currentUserEmail }}
        </div>
        <q-btn
          color="primary"
          unelevated
          @click="logout"
          :label="logBTN"
          style="margin-left: 10px"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
      :width="220"
    >
      <div class="q-gutter-md" style="padding: 10px 10px;">
        <q-select
          :value="theDomain"
          @input="pickTheDomain"
          filled
          dense
          options-dense
          bg-color="grey-2"
          :options="domainNames"
          emit-value
          label="Select a Domain"
        >
          <template v-slot:prepend> <q-icon name="sort_by_alpha" /> </template>
        </q-select>
        <q-select
          :value="theUserId"
          @input="pickTheUserId"
          filled
          dense
          options-dense
          bg-color="grey-2"
          :options="users"
          emit-value
          label="Select a User"
          v-show="userContext.role === 'supervisor'"
        >
          <template v-slot:prepend> <q-icon name="face" /> </template>
        </q-select>
        <q-select
          :value="theWorksetId"
          @input="pickTheWorksetId"
          filled
          dense
          options-dense
          bg-color="grey-2"
          :options="worksets"
          emit-value
          label="Select a Set"
        >
          <template v-slot:prepend>
            <q-icon name="folder" />
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section>
                <q-item-label v-html="scope.opt.label" />
                <q-item-label caption
                  >{{ scope.opt.rate }}
                  <q-badge
                    color="positive"
                    text-color="white"
                    text-size="sm"
                    v-show="scope.opt.allComplete"
                  >
                    완료
                  </q-badge>
                </q-item-label>
              </q-item-section>
            </q-item>
          </template></q-select
        >

        <q-list dense separator bordered class="bg-grey-1">
          <q-item
            clickable
            v-ripple
            v-for="item in entryIndex"
            :to="`/main/${item.value}`"
            :key="`${item.value}`"
          >
            <q-item-section>
              <q-item-label>
                {{ item.label }}
                <q-badge :color="`${item.stageColor}`">{{
                  item.stageText
                }}</q-badge>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <q-btn
        dense
        unelevated
        color="primary"
        @click="leftDrawerOpen = !leftDrawerOpen"
        aria-label="Menu"
        icon="menu"
      />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'MainLayout',

  data() {
    return {
      leftDrawerOpen: true,
    };
  },

  computed: {
    currentUser() {
      return this.$auth.currentUser;
    },
    logBTN() {
      return this.currentUser ? 'logout' : 'login';
    },
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
    ...mapState([
      'domainNames',
      'userContext',
      'theDomain',
      'users',
      'theUserId',
      'labels',
      'worksetStates',
      'theWorksetId',
      'entryStates',
      'theEntryId',
    ]),
    ...mapGetters([
      'defaultDomain',
      'currentUserEmail',
      'worksets',
      'entryIndex',
    ]),
  },
  watch: {
    theDomain() {
      this.syncWorksetStates();
    },
    theUserId() {
      this.syncWorksetStates();
    },
    theWorksetId() {
      this.syncEntryStates();
    },
  },

  methods: {
    ...mapActions([
      'fetchDomainNames',
      'fetchUserContext',
      'pickTheUserId',
      'fetchUsers',
      'pickTheDomain',
      'fetchLabels',
      'syncSummary',
      'syncWorksetStates',
      'pickTheWorksetId',
      'syncEntryStates',
      'pickTheEntryId',
    ]),
    logout() {
      this.$auth.signOut().then(() => {
        this.$router.push('/login');
      });
    },
    dialog(value) {
      this.$q.dialog({
        title: 'Log',
        message: `${value}`,
      });
    },
  },

  created() {
    Promise.all([this.fetchDomainNames(), this.fetchUserContext()]).then(() => {
      this.pickTheUserId(this.currentUserEmail);
      this.pickTheDomain(this.defaultDomain).then(() => {
        this.fetchUsers();
        this.fetchLabels();
        this.syncWorksetStates();
      });
    });
  },
  beforeDestroy() {
    //this.$auth.signOut();
  },
};
</script>
