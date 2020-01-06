<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container
      ><p>hi</p>
      <p>hi</p>
      <p>hi</p>
      <p>hi</p>
      <p>hi</p>
      <p>hi</p>
      <p>hi</p>
      <p>hi</p>
      <p>hi</p>
      <p>hi</p>
      <p>hi</p>
      <p>hi</p>
      <p>hi</p>
      <p>hi</p>
      <p>hi</p>
      <router-view />
    </q-page-container>
    <q-drawer
      v-model="right"
      side="right"
      bordered
      content-class="bg-grey-2"
      :width="360"
    >
      <div class="q-gutter-md" style="padding: 60px 10px 0px 10px;">
        <q-btn
          flat
          color="secondary"
          icon="arrow_left"
          :to="`/main/${theWorksetId}-${prevSuperNum}-01`"
          :disable="prevSuperNum === '00'"
        />
        <q-avatar square class="cursor-pointer" size="25px" color="grey-1">
          {{ theSuperNum }}
        </q-avatar>
        <q-btn
          flat
          color="secondary"
          icon="arrow_right"
          :to="`/main/${theWorksetId}-${nextSuperNum}-01`"
          :disable="lastEntryId === `${theWorksetId}-${nextSuperNum}-01`"
        />
        <q-bar dense class="bg-grey-4 text-black text-bold">
          <div>POS TAG</div>
        </q-bar>

        <q-markup-table
          flat
          dense
          wrap-cells
          separator="none"
          class="bg-grey-2"
        >
          <tr>
            <td>
              <q-btn
                outline
                rounded
                size="sm"
                style="width: 165px"
                label="일반명사"
                color="grey-8"
                :class="{
                  'bg-lime-3': isPos('nn'),
                }"
                @click="changePos('nn')"
              />
            </td>
            <td class="text-center">
              <q-btn
                outline
                rounded
                size="sm"
                style="width: 110px"
                label="개체명"
                color="grey-8"
                :class="{
                  'bg-lime-3': isPos('ne'),
                }"
                @click="changePos('ne')"
              />
            </td>
            <td class="text-center">
              <q-btn
                outline
                rounded
                size="sm"
                style="width: 110px"
                label="술어"
                color="grey-8"
                :class="{
                  'bg-lime-3': isPos('vv'),
                }"
                @click="changePos('vv')"
              />
            </td>
          </tr>
        </q-markup-table>

        <q-bar dense class="bg-grey-4 text-black text-bold">
          <div>SEM CODE</div>
          <q-space />

          <q-btn-toggle
            dense
            no-caps
            unelevated
            toggle-color="primary"
            color="grey-4"
            text-color="primary"
            :value="entry.isSkipped"
            :options="[
              { label: 'Keep', value: false },
              { label: 'Skip', value: true },
            ]"
            @input="changeSkip"
          />
        </q-bar>
        <q-markup-table
          flat
          dense
          wrap-cells
          separator="none"
          class="bg-grey-2"
        >
          <tr>
            <td>
              <q-btn
                outline
                rounded
                size="sm"
                style="width: 165px"
                label="일반명사"
                color="grey-8"
                :class="{
                  'bg-lime-3': isPos('nn'),
                }"
                @click="changePos('nn')"
              />
            </td>
          </tr>
        </q-markup-table>

        <q-bar dense class="bg-grey-4 text-black text-bold">
          <div>Synset</div>
        </q-bar>
      </div>
    </q-drawer>
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
    ]),
    ...mapGetters([
      'theSuperEntryId',
      'theSuperNum',
      'prevSuperNum',
      'nextSuperNum',
      'lastEntryId',
      'isPos',
    ]),
  },
  watch: {},

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
    ]),
    dialog(value) {
      this.$q.dialog({
        title: 'Log',
        message: `${value}`,
      });
    },
  },

  created() {},
};
</script>
<style></style>
