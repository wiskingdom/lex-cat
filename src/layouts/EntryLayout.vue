<template>
  <div class="row">
    <div class="col q-gutter-md" style="padding: 10px 20px;">
      <p>
        <span class="entry text-dark text-bold">{{ entry.orthForm }}</span>
      </p>
      <p>
        <span class=" sect text-blue-8 text-bold">관련어</span>
        <q-btn flat round dense icon="search" @click="onSearch" />
      </p>
      <p>
        <span
          class="ej text-dark"
          :class="{
            'text-blue-8': isSynMember(`${key}`),
            'text-bold': isSynMember(`${key}`),
            'cursor-pointer': !isSynMember(`${key}`),
          }"
          @click="mergeReady(`${key}`)"
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
        <span class=" ej text-dark">{{ entry.description }}</span>
        <span class=" ej text-dark" v-show="!entry.description">없음</span>
      </p>
      <!--
      <p>
        <span class=" sect text-blue-8 text-bold">이슈</span>
        <q-btn flat round dense icon="add" @click="pushIssue" />
      </p>
      -->

      <q-dialog
        v-model="mergPop"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-card>
          <q-card-section>
            <div class="text-h6">알림</div>
          </q-card-section>

          <q-card-section>
            동의어 세트를 병합합니다.
          </q-card-section>
          <q-card-section>
            <q-markup-table>
              <tr>
                <td>
                  <span
                    v-for="(item, index) in mergingSyns"
                    :key="`msyn-${index}`"
                    >{{ item }}<br
                  /></span>
                </td>
                <td>
                  <span>+</span>
                </td>
                <td>
                  <span v-for="(item, index) in syns" :key="`syn-${index}`"
                    >{{ item }}<br
                  /></span>
                </td>
              </tr>
            </q-markup-table>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn
              flat
              label="병합"
              @click="updateSynset('merge')"
              v-close-popup
            />
            <q-btn flat label="취소" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- search -->
      <q-dialog v-model="searchPop">
        <q-card>
          <q-card-section>
            <q-form @submit="searchSubmit" class="q-gutter-md">
              <q-input filled v-model="searchTerm" label="검색어" />
              <q-btn label="검색" type="submit" color="primary" />
            </q-form>
          </q-card-section>

          <q-separator />

          <q-card-section style="max-width: 300px" class="scroll">
            <p>
              <span
                class="ej text-dark"
                :class="{
                  'text-blue-8': isSynMember(`${key}`),
                  'text-bold': isSynMember(`${key}`),
                  'cursor-pointer': !isSynMember(`${key}`),
                }"
                @click="mergeReady(`${key}`)"
                v-for="(item, key) in searchedSimilar"
                v-show="item !== entry.orthForm"
                :key="key"
                >{{ item }}<br />
              </span>
            </p>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="닫기" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <!-- right side -->
    <div
      class="col-4 col-md-4 q-gutter-md"
      style="padding: 0px; border-left: 1px solid LightGray; min-width: 380px"
    >
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
        color="yellow-8"
        :value="entry.needCheck"
        @input="changeNeedCheck"
        label="보류"
      />

      <q-btn-toggle
        dense
        no-caps
        unelevated
        :toggle-color="entry.isSkipped ? 'dark' : 'secondary'"
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
          'bg-light-green-11': isPos('nn'),
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
          'bg-light-green-11': isPos('ne'),
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
          'bg-light-green-11': isPos('vv'),
        }"
        @click="changePos('vv')"
      />

      <q-bar dense class="bg-grey-4 text-black text-bold">
        <div>SEM CODE</div>
      </q-bar>
      <div style="min-height:160px">
        <span :class="semTagColor()" style="padding: 10px">{{
          `[${currentSemTag.value}] ${currentSemTag.tag}`
        }}</span>
        <q-input :value="entry.sem" label="Input Code" @input="changeSem" />
        <p></p>
        <q-btn
          outline
          flat
          size="13px"
          v-ripple
          v-for="item in semHints"
          :label="item.tag"
          color="grey-8"
          class="text-blue-8"
          @click="changeSem(item.value)"
          :key="`${item.value}`"
        />
      </div>
      <q-bar dense class="bg-grey-4 text-black text-bold">
        <div>Synset</div>
        <q-space />

        <q-btn
          unelevated
          color="deep-orange"
          label="해제"
          @click="unlink('delete')"
        />
      </q-bar>

      <p>
        <span
          :class="{
            'text-bold': item === entry.orthForm,
          }"
          v-for="(item, index) in syns"
          :key="index"
          >{{ item }}<br
        /></span>
      </p>
      <q-bar dense class="bg-grey-4 text-black text-bold">
        <div>Extra Syns</div>
      </q-bar>
      <q-form @submit="addExSyn">
        <q-input dense v-model="extraSyn" label="Input Extra Syn" />
      </q-form>
      <div
        v-for="(key, item) in entry.extraSyns"
        :key="key"
        class="q-gutter-xs"
      >
        <span>{{ item }} </span
        ><q-btn dense flat unelevated icon="clear" @click="removeExSyn(item)" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  name: 'EntryLayout',

  data() {
    return {
      right: true,
      mergPop: false,
      searchPop: false,
      searchTerm: '',
      extraSyn: '',
    };
  },

  computed: {
    ...mapState([
      'theDomain',
      'theUserId',
      'theWorksetId',
      'theEntryId',
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
      'theSuperNum',
      'prevSuperNum',
      'nextSuperNum',
      'lastEntryId',
      'isPos',
      'currentSemTag',
      'semHints',
      'isSem',
      'semValid',
      'semIsIn',
      'entryIndex',
      'isSynMember',
      'stageCode',
      'syns',
      'mergingSyns',
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
      'syncWorksets',
      'pickTheWorksetId',
      'pickTheEntryId',
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
      'changeExtraSyns', // 신규
      'updateEntry',
      'updateStageCode',
      'updateHasExtraSyns',
      'initEntry',
      'fetchIssue',
      'pushIssue',
    ]),
    push(path) {
      if (!this.entry.needCheck && !this.semValid) {
        this.dialog('범주 분류가 유효하지 않습니다.');
      } else {
        this.$router.push(path);
      }
      Promise.all([
        this.updateStageCode(this.stageCode),
        this.updateHasExtraSyns(),
      ]).then(this.updateEntry());
    },
    offSearch() {
      this.searchPop = false;
    },
    onSearch() {
      this.searchTerm = '';
      this.fetchSearchedSimilar('');
      this.searchPop = true;
    },
    searchSubmit() {
      this.fetchSearchedSimilar(this.searchTerm);
    },
    dialog(value) {
      this.$q.dialog({
        title: 'Log',
        message: `${value}`,
      });
    },
    unlink() {
      this.updateSynset('delete');
    },
    semTagColor() {
      if (!this.entry.sem) {
        return '';
      }
      if (!this.semIsIn) {
        return 'bg-deep-orange-2';
      }
      if (this.semValid) {
        return 'bg-light-green-11';
      } else {
        return 'bg-yellow-2';
      }
    },
    addExSyn() {
      if (this.extraSyn) {
        this.changeExtraSyns({ syn: this.extraSyn, type: 'add' });
      }
      this.extraSyn = '';
    },
    removeExSyn(syn) {
      this.changeExtraSyns({ syn, type: 'delete' });
    },
    update() {
      if (!this.entry.needCheck && !this.entry.isSkipped && !this.semValid) {
        this.dialog('범주 분류가 유효하지 않습니다.');
      }
      Promise.all([
        this.updateStageCode(this.stageCode),
        this.updateHasExtraSyns(),
      ]).then(this.updateEntry());
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
      } else {
        this.mergPop = false;
      }
    },
    fetch() {
      const { entryId } = this.$route.params;
      this.pickTheEntryId(entryId).then(() => {
        this.fetchEntry().then(() => {
          this.fetchSynset();
        });
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
            this.syncWorksets();
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
  beforeDestroy() {
    this.initEntry();
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
