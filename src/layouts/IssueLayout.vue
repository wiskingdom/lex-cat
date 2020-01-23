<template>
  <q-layout view="hHh lpR fFf">
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
      :width="270"
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
      </div>
    </q-drawer>

    <q-page-container>
      <q-btn
        dense
        unelevated
        color="grey-5"
        @click="leftDrawerOpen = !leftDrawerOpen"
        aria-label="Menu"
        icon="menu"
      />
      <router-view :key="$route.fullPath" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'IssueLayout',

  data() {
    return {
      leftDrawerOpen: true,
    };
  },

  computed: {
    ...mapState([
      'domainNames',
      'userContext',
      'theDomain',
      'users',
      'theUserId',
      'theIssueCode',
    ]),
    ...mapGetters([]),
  },

  watch: {},

  methods: {
    ...mapActions([
      'fetchDomainNames',
      'fetchUserContext',
      'fetchRoles',
      'fetchUsers',
      'pickTheUserId',
      'pickTheDomain',
      'fetchLabels',
      'syncSummary',
      'syncWorksets',
      'unsyncWorksets',
      'pickTheWorksetId',
      'initEntryMarkings',
      'fetchEntryMarkings',
      'pickTheEntryId',
    ]),
    mainInit() {},
    dialog(value) {
      this.$q.dialog({
        title: 'Log',
        message: `${value}`,
      });
    },
  },

  created() {},

  beforeDestroy() {},
};
</script>
