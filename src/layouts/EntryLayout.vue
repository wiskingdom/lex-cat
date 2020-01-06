<template>
  <q-layout view="hHh lpR fFf">
    <q-drawer show-if-above v-model="right" side="right" bordered :width="360">
      <div class="q-gutter-md" style="padding: 60px 10px 0px 10px;">
        <q-btn
          dense
          flat
          color="primary"
          icon="arrow_left"
          @click="push(`/main/${theWorksetId}-${prevSuperNum}-01`)"
          :disable="prevSuperNum === '00'"
        />
        <q-btn flat dense color="primary" icon="done" @click="update" />
        <q-btn
          dense
          flat
          color="primary"
          icon="arrow_right"
          @click="push(`/main/${theWorksetId}-${nextSuperNum}-01`)"
          :disable="lastEntryId === nextSuperNum"
        />
        <q-checkbox
          dense
          flat
          size="md"
          left-label
          text-color="primary"
          color="secondary"
          :value="entry.needCheck"
          @input="changeNeedCheck"
          label="보류"
        />

        <q-btn-toggle
          dense
          no-caps
          unelevated
          toggle-color="secondary"
          color="grey-4"
          text-color="black"
          :value="entry.isSkipped"
          :options="[
            { label: '등재', value: false },
            { label: '미등재', value: true },
          ]"
          @input="changeSkip"
        />

        <q-bar dense class="bg-grey-4 text-black text-bold">
          <div>POS TAG</div>
        </q-bar>

        <q-btn
          outline
          flat
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
          flat
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
          flat
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
          flat
          size="sm"
          v-ripple
          v-for="item in semHints"
          :label="item.tag"
          color="grey-8"
          class="text-blue-8 text-bold"
          :class="{
            'bg-positive': isSem(item.value),
          }"
          @click="changeSem(item.value)"
          :key="`${item.value}`"
        />
        <q-bar dense class="bg-grey-4 text-black text-bold">
          <div>Synset</div>
          <q-space />

          <q-btn color="deep-orange" label="해제" @click="unlink('delete')" />
        </q-bar>

        <p>
          <span v-for="(item, index) in syns" :key="index"
            >{{ item }}<br
          /></span>
        </p>
      </div>
    </q-drawer>

    <q-page-container>
      <div class="q-gutter-md" style="padding: 30px 15px 0px 15px;">
        <p>
          <span class="entry text-dark text-bold">{{
            superEntry.orthForm
          }}</span>
        </p>
        <p>
          <span class=" sect text-blue-8 text-bold">관련어</span>
        </p>
        <p>
          <span
            class="ej text-dark"
            :class="{
              'text-blue-8': isSynMember(`${key}-01`),
              'text-bold': isSynMember(`${key}-01`),
              'cursor-pointer': !isSynMember(`${key}-01`),
            }"
            @click="mergeReady(`${key}-01`)"
            v-for="(item, key) in similars"
            v-show="item !== entry.orthForm"
            :key="key"
            >[ {{ item }} ],
          </span>
        </p>
        <p>
          <span class=" sect text-blue-8 text-bold">정의</span>
        </p>
        <p>
          <span class=" ej text-dark">{{ superEntry.description }}</span>
          <span class=" ej text-dark" v-show="!superEntry.description"
            >없음</span
          >
        </p>

        <q-dialog v-model="mergPop" :key="'merge'">
          <q-card>
            <q-card-section>
              <div class="text-h6">알림</div>
            </q-card-section>

            <q-card-section>
              동의어 세트를 병합합니다.
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn
                flat
                label="병합"
                @click="updateSynset('merge').then(fetchSynset)"
                v-close-popup
              />
              <q-btn flat label="취소" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
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
      mergPop: false,
    };
  },

  computed: {
    ...mapState([
      'entryStates',
      'theDomain',
      'theUserId',
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
      'syns',
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
      'isSynMember',
      'stageCode',
    ]),
  },
  watch: {
    $route: {
      handler() {
        this.update();
        if (!this.theDomain || !this.theUserId) {
          this.allFetch();
        } else {
          this.fetch();
        }
      },
    },
  },

  methods: {
    ...mapActions([
      'fetchDomainNames',
      'fetchUserContext',
      'fetchUsers',
      'pickTheUserId',
      'pickTheDomain',
      'fetchLabels',
      'syncSummary',
      'syncWorksetStates',
      'pickTheWorksetId',
      'syncEntryStates',
      'pickTheEntryId',
      'fetchSuperEntry',
      'fetchSimilars',
      'fetchSearchedSimilar',
      'fetchEntry',
      'fetchSynset',
      'fetchMergingSynset',
      'fetchIssue',
      'updateSynset',
      'changeSkip',
      'changeNeedCheck',
      'changePos',
      'changeSem',
      'updateEntryLabels',
      'changeStageCode',
    ]),
    push(path) {
      if (!this.entry.needCheck && !this.semValid) {
        this.dialog('SEM CODE 입력이 유효하지 않습니다.');
      } else {
        this.$router.push(path);
      }
      this.changeStageCode(this.stageCode).then(this.updateEntryLabels());
    },
    dialog(value) {
      this.$q.dialog({
        title: 'Log',
        message: `${value}`,
      });
    },
    unlink() {
      this.updateSynset('delete').then(() => {
        this.fetchSynset();
      });
    },
    update() {
      if (!this.entry.needCheck && !this.semValid) {
        this.dialog('SEM CODE 입력이 유효하지 않습니다.');
      }
      this.changeStageCode(this.stageCode).then(this.updateEntryLabels());
    },
    mergeReady(key) {
      if (!this.synset) {
        this.fetchMergingSynset(key).then(() => {
          this.mergPop = true;
        });
      } else if (!this.synset[key]) {
        this.fetchMergingSynset(key).then(() => {
          this.mergPop = true;
        });
      }
    },
    fetch() {
      const { entryId } = this.$route.params;
      this.pickTheEntryId(entryId).then(() => {
        this.fetchEntry().then(() => {
          this.fetchSynset();
        });
        this.fetchSuperEntry();
        this.fetchSimilars();
        this.pickTheEntryId(entryId);
        const worksetId = entryId
          .split('-')
          .slice(0, 2)
          .join('-');
        this.pickTheWorksetId(worksetId);
      });
    },
    allFetch() {
      Promise.all([this.fetchDomainNames(), this.fetchUserContext()]).then(
        () => {
          this.pickTheUserId(this.currentUserEmail);
          this.pickTheDomain(this.defaultDomain).then(() => {
            this.fetchUsers();
            this.fetchLabels();
            this.syncWorksetStates();
            this.fetch();
          });
        },
      );
    },
  },

  created() {
    if (!this.theDomain || !this.theUserId) {
      this.allFetch();
    } else {
      this.fetch();
    }
  },
};
</script>
<style>
.entry {
  font-size: xx-large;
}
.sect {
  font-size: x-large;
}
.ej {
  font-size: medium;
}
</style>
