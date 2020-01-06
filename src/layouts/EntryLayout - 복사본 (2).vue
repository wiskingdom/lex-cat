<template>
  <q-layout view="hHh lpR fFf">
    <q-drawer show-if-above v-model="right" side="right" bordered :width="360">
      <div class="q-gutter-md" style="padding: 60px 10px 0px 10px;">
        <q-btn
          dense
          color="secondary"
          icon="arrow_left"
          :to="`/main/${theWorksetId}-${prevSuperNum}-01`"
          :disable="prevSuperNum === '00'"
          @click="update"
        />
        <q-btn
          dense
          color="secondary"
          label="save"
          :disable="lastEntryId === nextSuperNum"
          @click="update"
        />
        <q-btn
          dense
          color="secondary"
          icon="arrow_right"
          :to="`/main/${theWorksetId}-${nextSuperNum}-01`"
          :disable="lastEntryId === nextSuperNum"
          @click="update"
        />
        <q-checkbox
          dense
          size="md"
          left-label
          text-color="primary"
          color="teal"
          :value="entry.needCheck"
          @input="changeNeedCheck"
          label="Check"
        />

        <q-btn-toggle
          dense
          no-caps
          unelevated
          toggle-color="primary"
          color="grey-4"
          text-color="black"
          :value="entry.isSkipped"
          :options="[
            { label: 'KEEP', value: false },
            { label: 'SKIP', value: true },
          ]"
          :class="{
            'bg-positive': entry.isSkipped,
          }"
          @input="changeSkip"
        />

        <q-bar dense class="bg-grey-4 text-black text-bold">
          <div>POS TAG</div>
        </q-bar>

        <q-btn
          outline
          v-ripple
          size="md"
          label="NN"
          color="grey-8"
          :class="{
            'bg-positive': isPos('nn'),
          }"
          @click="changePos('nn')"
        />
        <q-btn
          outline
          v-ripple
          size="md"
          label="NE"
          color="grey-8"
          :class="{
            'bg-positive': isPos('ne'),
          }"
          @click="changePos('ne')"
        />
        <q-btn
          outline
          v-ripple
          size="md"
          label="VV"
          color="grey-8"
          :class="{
            'bg-positive': isPos('vv'),
          }"
          @click="changePos('vv')"
        />

        <q-bar dense class="bg-grey-4 text-black text-bold">
          <div>SEM CODE</div>
        </q-bar>
        <q-input
          :value="entry.sem"
          :label="currentSemTag.tag"
          @input="changeSem"
        />
        <q-btn
          outline
          size="sm"
          v-ripple
          v-for="item in semHints"
          :label="item.tag"
          color="grey-8"
          :class="{
            'bg-positive': isSem(item.value),
          }"
          @click="changeSem(item.value)"
          :key="`${item.value}`"
        />
        <q-bar dense class="bg-grey-4 text-black text-bold">
          <div>Synset</div>
        </q-bar>

        <p>entryIndex:{{ entryIndex }}</p>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'EntryLayout',

  data() {
    return {
      right: true,
    };
  },

  computed: {
    ...mapState([
      'theWorksetId',
      'theEntryId',
      'superEntry',
      'similars',
      'searchedSimilar',
      'entry',
      'synset',
      'mergingSynset',
      'mergingSynsetId',
      'issue',
      'labels',
    ]),
    ...mapGetters([
      'theSuperEntryId',
      'theSuperNum',
      'prevSuperNum',
      'nextSuperNum',
      'lastEntryId',
      'isPos',
      'currentSemTag',
      'semHints',
      'isSem',
      'semValid',
      'entryIndex',
      'synsetList',
      'theWorksetId',
    ]),
  },
  watch: {
    $route: {
      handler() {
        this.update();
        const { entryId } = this.$route.params;
        this.pickTheEntryId(entryId).then(() => {
          this.fetchEntry().then(() => {
            this.syncSynset();
          });
          this.fetchSuperEntry();
          this.fetchSimilars();
          this.pickTheEntryId(entryId);

          const worksetId = entryId
            .split('-')
            .slice(0, 2)
            .join('-');
          this.pickTheWorksetId(worksetId);
          this.dialog(this.$route.params);
        });
      },
    },
  },

  methods: {
    ...mapActions([
      'pickTheEntryId',
      'fetchSuperEntry',
      'fetchSimilars',
      'fetchSearchedSimilar',
      'fetchEntry',
      'syncSynset',
      'fetchMergingSynset',
      'updateSynset',
      'fetchIssue',
      'changeSkip',
      'changeNeedCheck',
      'changePos',
      'changeSem',
      'updateEntryLabels',
      'pickTheWorksetId',
      'syncEntryStates',
    ]),
    dialog(value) {
      this.$q.dialog({
        title: 'Log',
        message: `${value}`,
      });
    },
    update() {
      if (this.entry.sem && !this.semValid) {
        this.dialog('SEM CODE 입력이 유효하지 않습니다.');
      }
      this.updateEntryLabels();
    },
  },

  created() {
    const { entryId } = this.$route.params;
    this.pickTheEntryId(entryId).then(() => {
      this.fetchEntry().then(() => {
        this.syncSynset();
      });
      this.fetchSuperEntry();
      this.fetchSimilars();
      this.pickTheEntryId(entryId);
      const worksetId = entryId
        .split('-')
        .slice(0, 2)
        .join('-');
      this.pickTheWorksetId(worksetId);
      this.dialog(this.entry.orthForm);
    });
  },
};
</script>
<style></style>
