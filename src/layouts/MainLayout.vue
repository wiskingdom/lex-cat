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
        <q-select
          :value="theWorksetId"
          @input="pickTheWorksetId"
          filled
          dense
          options-dense
          bg-color="grey-2"
          :options="worksetIndex"
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
                  <q-badge
                    color="deep-orange-8"
                    text-color="white"
                    text-size="sm"
                    v-show="scope.opt.cntOpenIssues"
                  >
                    {{ scope.opt.cntOpenIssues }}
                  </q-badge>
                  <q-badge
                    color="indigo-8"
                    text-color="white"
                    text-size="sm"
                    v-show="scope.opt.cntRepliedIssues"
                  >
                    {{ scope.opt.cntRepliedIssues }}
                  </q-badge>
                  <q-badge
                    color="grey-8"
                    text-color="white"
                    text-size="sm"
                    v-show="scope.opt.cntClosedIssues"
                  >
                    {{ scope.opt.cntClosedIssues }}
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
                }}</q-badge
                ><q-badge
                  :color="`${item.issueColor}`"
                  v-show="item.issueText"
                  >{{ item.issueText }}</q-badge
                ><q-space />
                <q-badge
                  outline
                  color="secondary"
                  v-show="item.hasSynsetText"
                  >{{ item.hasSynsetText }}</q-badge
                >
                <q-badge
                  outline
                  color="grey-8"
                  v-show="item.hasExtraSynsText"
                  >{{ item.hasExtraSynsText }}</q-badge
                >
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
  name: 'MainLayout',

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
      'theWorksetId',
    ]),
    ...mapGetters([
      'defaultDomain',
      'worksetIndex',
      'entryIndex',
      'annotatorCode',
    ]),
  },

  watch: {
    theDomain() {
      this.unsyncWorksets().then(() => {
        this.fetchUsers();
        this.fetchLabels();
        this.fetchGuide();
        this.fetchSearchLinks();
        this.syncWorksets();
      });
      this.pickTheWorksetId('');
      if (this.$route.params.entryId) {
        this.$router.push('/main/about');
      }
    },
    theUserId() {
      this.unsyncWorksets().then(this.syncWorksets());
      this.pickTheWorksetId('');
      if (this.$route.params.entryId) {
        this.$router.push('/main/about');
      }
    },
    theWorksetId() {
      this.fetchEntryMarkings();
      if (this.$route.params.entryId) {
        this.$router.push('/main/about');
      }
    },
  },

  methods: {
    ...mapActions([
      'fetchDomainNames',
      'fetchUserContext',
      'fetchRoles',
      'fetchUsers',
      'pickTheUserId',
      'pickTheDomain',
      'fetchGuide',
      'fetchSearchLinks',
      'fetchLabels',
      'syncSummary',
      'syncWorksets',
      'unsyncWorksets',
      'pickTheWorksetId',
      'initEntryMarkings',
      'fetchEntryMarkings',
      'pickTheEntryId',
    ]),
    mainInit() {
      Promise.all([
        this.fetchDomainNames(),
        this.fetchUserContext(),
        this.fetchRoles(),
      ])
        .then(() =>
          Promise.all([
            this.pickTheDomain(this.defaultDomain),
            this.fetchUsers(),
          ]),
        )
        .then(() => {
          this.fetchLabels();
          this.fetchGuide();
          this.fetchSearchLinks();
          this.syncWorksets();
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
    this.mainInit();
  },

  beforeDestroy() {
    this.pickTheWorksetId('');
    this.initEntryMarkings();
  },
};
</script>
