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
        <q-form @submit="searchSubmit" class="q-gutter-md">
          <q-input dense filled v-model="searchTerm" label="Synset Id" />
          <q-btn dense unelevated label="검색" type="submit" color="primary" />
        </q-form>
        <p></p>
        <p>
          {{ seSynsetMessage }}
        </p>
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
  name: 'SesLayout',

  data() {
    return {
      leftDrawerOpen: true,
      searchTerm: '',
      searchedMessage: '',
    };
  },

  computed: {
    ...mapState([
      'domainNames',
      'userContext',
      'theDomain',
      'seSynset',
      'seSynsetMessage',
    ]),
    ...mapGetters(['defaultDomain']),
  },

  watch: {
    theDomain(newVal, oldVal) {
      this.fetchLabels();
      this.fetchGuide();
      this.fetchSearchLinks();
      this.markFetchedSes();
      if (oldVal && newVal !== oldVal) {
        this.$router.push(`/ses/${newVal}/about`);
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
      'checkSeSynset',
      'markFetchedSes',
    ]),
    mainInit() {
      Promise.all([
        this.fetchDomainNames(),
        this.fetchUserContext(),
        this.fetchRoles(),
      ])
        .then(() => this.pickTheDomain(this.defaultDomain))
        .then(() => {
          this.fetchLabels();
          this.fetchGuide();
          this.fetchSearchLinks();
          this.markFetchedSes();
          this.$router.push(`/ses/${this.defaultDomain}/about`);
        });
    },
    searchSubmit() {
      this.checkSeSynset(this.searchTerm)
        .then(id => {
          this.$router.push(`/ses/${this.defaultDomain}/${id}`);
        })
        .catch(() => {
          if (this.$router.currentRoute.name !== 'sesAbout') {
            this.$router.push(`/ses/${this.defaultDomain}/about`);
          }
        });
      this.searchTerm = '';
    },
    dialog(value) {
      this.$q.dialog({
        title: 'Log',
        message: `${value}`,
      });
    },
  },

  created() {
    if (this.$router.currentRoute.name !== 'synset') {
      this.mainInit();
    }
  },

  beforeDestroy() {},
};
</script>
