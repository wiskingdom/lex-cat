<template>
  <div class="row">
    <div class="col q-gutter-md" style="padding: 10px 20px;">
      <div class="row">
        <div class="col">
          <span class="entry text-dark text-bold">{{ entry.orthForm }} </span
          ><span class="entry text-dark text-bold" v-show="entry.senseNum > 1"
            >[{{ entry.senseNum }}]
          </span>
          <q-btn
            flat
            round
            dense
            icon="file_copy"
            @click="copyToClipboard(entry.orthForm)"
          />
        </div>
        <div class="col">
          <q-btn
            class="text-bold"
            color="grey-8"
            unelevated
            :label="item.label"
            style="margin-left: 10px"
            @click="externPop(item.linkParts)"
            v-for="(item, index) in searchLinks"
            :key="`externLink${index}`"
          />
        </div>
      </div>
      <p>
        <span class=" sect text-blue-8 text-bold">동의어</span>
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
      </p>
      <!-- issue -->
      <p>
        <span class=" sect text-blue-8 text-bold">이슈</span>
      </p>
      <div class="q-pa-md q-gutter-sm">
        <q-card
          :class="
            roles.supervisor.includes(item.sender)
              ? 'bg-indigo-1'
              : 'bg-deep-orange-1'
          "
          flat
          bordered
          v-for="(item, index) in Object.values(issue.messages)"
          :key="`issue${index}`"
        >
          <q-card-section v-html="item.text" v-if="item.text" />
          <q-card-section align="right">
            <span v-if="item.sender">{{ item.sender }}</span>
          </q-card-section>
        </q-card>
      </div>

      <div style="min-height:50px"></div>

      <!-- merge dialog-->
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
      <!-- search dialog-->
      <q-dialog v-model="searchPop">
        <q-card>
          <q-card-section>
            <q-form @submit="searchSubmit" class="q-gutter-md">
              <q-input dense filled v-model="searchTerm" label="검색어" />
              <q-btn
                dense
                unelevated
                label="검색"
                type="submit"
                color="primary"
              />
            </q-form>
            <p></p>
            <p>
              {{ searchedMessage }}
            </p>
          </q-card-section>

          <q-separator />

          <q-card-section
            style="min-width: 500px; min-height: 200px; max-height: 200px"
            class="scroll"
          >
            <q-markup-table dense flat>
              <thead>
                <tr>
                  <th class="text-left">키워드</th>
                  <th class="text-left">다의</th>
                  <th class="text-left">품사분류</th>
                  <th class="text-left">의미분류</th>
                  <th class="text-left">정의</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  @click="mergeReady(`${key}`)"
                  class="ej text-dark"
                  :class="{
                    'text-blue-8': isSynMember(`${key}`),
                    'text-bold': isSynMember(`${key}`),
                    'cursor-pointer': !isSynMember(`${key}`),
                  }"
                  v-for="(item, key) in searchedSimilar"
                  v-show="item.orthForm !== entry.orthForm"
                  :key="key"
                >
                  <td>
                    {{ item.orthForm }}
                  </td>
                  <td>
                    {{ item.senseNum }}
                  </td>
                  <td>
                    {{ item.pos }}
                  </td>
                  <td>
                    {{ semCodeToTag(item.sem) }}
                  </td>
                  <td>
                    <span v-show="item.description"
                      >보기<q-tooltip
                        content-style="font-size: 13px"
                        anchor="top left"
                        self="bottom middle"
                      >
                        {{ item.description }}
                      </q-tooltip></span
                    ><span v-show="!item.description">없음</span>
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
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
      style="padding: 0px; border-left: 1px solid LightGray; min-width: 390px"
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

      <p>
        <span :class="semTagColor()" style="padding: 10px">{{
          `[${currentSemTag.value}] ${currentSemTag.tag}`
        }}</span>
      </p>
      <q-input dense :value="entry.sem" label="Input Code" @input="changeSem" />
      <p></p>
      <div class="row" style="min-height:70px">
        <div class="col">
          <q-btn
            dense
            unelevated
            round
            icon="arrow_upward"
            size="13px"
            v-ripple
            class="text-blue-8"
            @click="changeSem(`${entry.sem.slice(0, -1)}`)"
          />
        </div>
        <div class="col-11">
          <q-btn
            outline
            flat
            size="13px"
            v-ripple
            v-for="item in semHints"
            :label="item.tag"
            color="grey-8"
            @click="changeSem(item.value)"
            :key="`${item.value}`"
          />
        </div>
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

      <ul style="list-style-type:none; padding-left: 15px;">
        <li
          :class="{
            'text-bold': item === entry.orthForm,
          }"
          v-show="Object.keys(syns).length > 1"
          v-for="(item, index) in syns"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>

      <q-bar dense class="bg-grey-4 text-black text-bold">
        <div>Extra Syns</div>
      </q-bar>
      <q-form @submit="addExSyn">
        <q-input dense v-model="extraSyn" label="Input Extra Syn" />
      </q-form>
      <ul style="list-style-type:none; padding-left: 15px;">
        <li
          v-for="(key, item) in entry.extraSyns"
          :key="key"
          class="q-gutter-xs"
        >
          <span>{{ item }} </span
          ><q-btn
            dense
            unelevated
            size="8px"
            color="deep-orange"
            icon="clear"
            style="margin: 5px 5px"
            @click="removeExSyn(item)"
          />
        </li>
      </ul>
      <q-bar
        dense
        class="bg-grey-4 text-black text-bold"
        v-show="userContext.role === 'supervisor'"
      >
        <div>Poly</div>
        <q-space />

        <q-btn unelevated color="primary" label="확장" @click="addPolyItem()" />
      </q-bar>
      <q-bar dense class="bg-grey-4 text-black text-bold">
        <div>ISSUE</div>
        <q-space />
        <q-checkbox
          dense
          flat
          size="md"
          left-label
          text-color="primary"
          color="grey-8"
          v-show="Object.values(issue.messages).length > 0"
          :value="issue.isClosed"
          @input="onoffIssue"
          label="닫음"
        />
      </q-bar>
      <div class="row">
        <q-btn
          flat
          round
          dense
          class="text-blue-8"
          icon="add"
          @click="pushIssuHandle"
        />
        <q-editor
          v-model="editor"
          min-height="5rem"
          style="width: 80%; max-width: 600px"
          :toolbar="[['bold', 'italic', 'strike', 'underline']]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { copyToClipboard } from 'quasar';

export default {
  name: 'MainEntry',

  data() {
    return {
      right: true,
      mergPop: false,
      searchPop: false,
      searchTerm: '',
      extraSyn: '',
      editor: '',
    };
  },

  computed: {
    ...mapState([
      'roles',
      'domainNames',
      'userContext',
      'fetchedMain',
      'theDomain',
      'domainCodeMap',
      'theUserId',
      'theWorksetId',
      'theEntryId',
      'similars',
      'searchedSimilar',
      'searchedMessage',
      'entry',
      'synset',
      'mergingSynset',
      'mergingSynsetId',
      'issue',
      'labels',
      'searchLinks',
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

  methods: {
    ...mapActions([
      'fetchDomainNames',
      'fetchUserContext',
      'fetchUsers',
      'fetchRoles',
      'pickTheUserId',
      'pickTheDomain',
      'fetchLabels',
      'syncSummary',
      'markFetchedMain',
      'syncWorksets',
      'pickTheWorksetId',
      'pickTheEntryId',
      'fetchSimilars',
      'fetchSearchedSimilar',
      'fetchEntry',
      'fetchSynset',
      'fetchMergingSynset',
      'updateSynset',
      'changeSkip',
      'changeNeedCheck',
      'changePos',
      'changeSem',
      'changeExtraSyns', // 신규
      'updateEntry',
      'updateStageCode',
      'updateExtraSyns',
      'initEntry',
      'fetchIssue',
      'pushIssue',
      'onoffIssue',
      'addPoly',
      'fetchEntryMarkings',
    ]),
    copyToClipboard: copyToClipboard,
    semCodeToTag(semCode) {
      const tag = this.labels.sem[semCode];
      if (!semCode) {
        return '미분류';
      }
      return `[${semCode}] ${tag}`;
    },
    pushIssuHandle() {
      const text = this.editor
        .trim()
        .replace(/(<div><br><\/div>)+/g, '<div><br></div>')
        .replace(/(<div><br><\/div>)$/, '')
        .replace(/^(<div><br><\/div>)/, '')
        .trim();
      this.pushIssue({
        sender: this.$auth.currentUser.email,
        text,
      });
      this.editor = '';
    },
    externPop(linkParts) {
      const link = `${linkParts.pre}${this.entry.orthForm}${linkParts.post}`;
      const linkUri = encodeURI(link);
      window.open(linkUri, 'popup', 'width=900,height=900');
      return false;
    },
    push(path) {
      if (!this.entry.needCheck && !this.semValid) {
        this.dialog('범주 분류가 유효하지 않습니다.');
      } else {
        this.$router.push(path);
      }
      Promise.all([this.updateStageCode(this.stageCode)]).then(
        this.updateEntry(),
      );
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
        this.changeExtraSyns({ syn: this.extraSyn, type: 'add' }).then(
          this.updateExtraSyns(),
        );
      }
      this.extraSyn = '';
    },
    removeExSyn(syn) {
      this.changeExtraSyns({ syn, type: 'delete' }).then(
        this.updateExtraSyns(),
      );
    },
    update() {
      if (!this.entry.needCheck && !this.entry.isSkipped && !this.semValid) {
        this.dialog('범주 분류가 유효하지 않습니다.');
      }
      Promise.all([this.updateStageCode(this.stageCode)]).then(
        this.updateEntry(),
      );
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
    addPolyItem() {
      this.addPoly();
    },
    fetch() {
      const { entryId } = this.$route.params;
      this.pickTheEntryId(entryId).then(() => {
        const domainCode = entryId.split('-')[0];
        const worksetId = entryId
          .split('-')
          .slice(0, 2)
          .join('-');

        if (
          this.fetchedMain &&
          this.domainCodeMap[domainCode] === this.theDomain
        ) {
          this.fetchEntry().then(() => {
            this.fetchSynset();
          });
          this.fetchIssue();
        } else {
          Promise.all([
            this.fetchDomainNames(),
            this.fetchUserContext(),
            this.fetchRoles(),
          ]).then(() => {
            this.pickTheUserId(this.$auth.currentUser.email);
            this.pickTheDomain(this.domainCodeMap[domainCode]).then(() => {
              this.fetchLabels();
              this.fetchUsers().then(this.syncWorksets);
              this.markFetchedMain();
              this.fetchEntry().then(() => {
                this.fetchSynset();
              });
              this.fetchSimilars();
              this.fetchIssue();
              this.pickTheWorksetId(worksetId);
            });
          });
        }
      });
    },
  },
  beforeCreate() {
    const { entryId } = this.$route.params;
    if (!entryId.match(/\w{3}-\d{4}-\d{2}-\d{2}/)) {
      this.$router.go(-1);
    }
  },
  created() {
    this.fetch();
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
