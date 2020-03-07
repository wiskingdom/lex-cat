import fireapp from '@/fireapp';

const db = fireapp.database();
const auth = fireapp.auth();

const changeTheCurrentUser = ({ commit }, payload) =>
  new Promise(resolve => {
    if (payload) {
      commit('THE_CURRENT_USER', payload);
      resolve();
    } else {
      commit('THE_CURRENT_USER', {
        email: '',
      });
      resolve();
    }
  });
const fetchDomainNames = ({ commit }) =>
  new Promise(resolve => {
    db.ref('/app/domainNames')
      .once('value')
      .then(snap => {
        const domainCodeMap = snap.val();
        commit('DOMAIN_CODE_MAP', domainCodeMap);
        commit('DOMAIN_NAMES', Object.values(domainCodeMap));
        resolve();
      });
  });
const fetchUserContext = ({ commit }) =>
  new Promise(resolve => {
    db.ref(`/app/userContext/${auth.currentUser.uid}`)
      .once('value')
      .then(snap => {
        commit('USER_CONTEXT', snap.val());
        resolve();
      });
  });
const initUserContext = ({ commit }) =>
  new Promise(resolve => {
    commit('USER_CONTEXT', {
      default: '',
      role: 'annotator',
      code: 0,
    });
    resolve();
  });

const pickTheDomain = ({ commit }, domainName) =>
  new Promise(resolve => {
    commit('THE_DOMAIN', domainName);
    resolve();
  });
const pickTheUserId = ({ commit }, userId) =>
  new Promise(resolve => {
    commit('THE_USER_ID', userId);
    resolve();
  });

const fetchUsers = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/app/users/${state.theDomain}`)
      .once('value')
      .then(snap => {
        commit('USERS', snap.val());
        resolve();
      });
  });
const fetchRoles = ({ commit }) =>
  new Promise(resolve => {
    db.ref('/app/roles')
      .once('value')
      .then(snap => {
        commit('ROLES', snap.val());
        resolve();
      });
  });

const fetchGuide = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/app/guide/${state.theDomain}`)
      .once('value')
      .then(snap => {
        commit('GUIDE', snap.val());
        resolve();
      });
  });

const fetchSearchLinks = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/app/searchLinks/${state.theDomain}`)
      .once('value')
      .then(snap => {
        commit('SEARCH_LINKS', snap.val());
        resolve();
      });
  });

const fetchLabels = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/app/labels/${state.theDomain}`)
      .once('value')
      .then(snap => {
        commit('LABELS', snap.val());
        resolve();
      });
  });
const markFetchedMain = ({ commit }) => {
  commit('FETCHED_MAIN', true);
};

const syncWorksets = ({ state, commit }) => {
  const annotatorCode = state.users.indexOf(state.theUserId);
  const ref = db
    .ref(`/dict/${state.theDomain}/worksets`)
    .orderByChild('annotatorCode')
    .equalTo(annotatorCode);
  ref.on('value', snap => {
    commit('WORKSETS', snap.val());
    commit('WORKSETS_REF', ref);
  });
};
const unsyncWorksets = ({ state }) =>
  new Promise(resolve => {
    const { worksetsRef } = state;
    if (worksetsRef) {
      worksetsRef.off();
      resolve();
    } else {
      resolve();
    }
  });

const pickTheWorksetId = ({ commit }, worksetId) =>
  new Promise(resolve => {
    commit('THE_WORKSET_ID', worksetId);
    resolve();
  });

const initEntryMarkings = ({ commit }) => {
  commit('ENTRY_MARKINGS', {});
};
const fetchEntryMarkings = ({ state, commit }) => {
  if (state.theWorksetId) {
    const ref = db.ref(
      `/dict/${state.theDomain}/entryMarkings/${state.theWorksetId}`,
    );
    ref.once('value', snap => {
      commit('ENTRY_MARKINGS', snap.val());
    });
  } else {
    commit('ENTRY_MARKINGS', {});
  }
};

const syncSummary = ({ state, commit }) => {
  const ref = db.ref(`/dict/${state.theDomain}/summary`);
  ref.on('value', snap => {
    commit('SUMMARY', { snap: snap.val(), ref });
  });
};

const pickTheEntryId = ({ commit }, entryId) =>
  new Promise(resolve => {
    commit('THE_ENTRY_ID', entryId);
    resolve();
  });

const initEntry = ({ commit }) => {
  commit('SIMILARS', {});
  commit('ENTRY', {
    orthForm: '',
    domain: '',
    sourcedFrom: '',
    description: '',
    isSkipped: false,
    needCheck: false,
    pos: '',
    sem: '',
    synOf: '',
    extraSyns: {},
    updatedBy: '',
  });
  commit('SYNSET', {});
  commit('ISSUE', {
    isImportant: false,
    isClosed: false,
    messages: {},
  });
};

const fetchSimilars = ({ state, commit }) => {
  const ref = db.ref(`/dict/${state.theDomain}/similars`);
  ref.once('value', snap => {
    commit('SIMILARS', snap.val());
  });
};

const fetchSearchedSimilar = ({ state, commit }, string) => {
  if (string.length > 1) {
    const directString = string.toUpperCase().replace(/ -/g, '');
    const ref = db
      .ref(`/dict/${state.theDomain}/entries`)
      .orderByChild('directForm')
      .startAt(directString)
      .endAt(`${directString}\uf8ff")`);
    ref.once('value').then(snap => {
      if (snap.exists()) {
        const theValue = snap.val();
        const entryIds = Object.keys(theValue);
        let similar = {};
        entryIds.forEach(entryId => {
          similar[entryId] = theValue[entryId];
        });
        commit('SEARCHED_SIMILAR', similar);
        commit('SEARCHED_MESSAGE', '검색 결과입니다.');
      } else {
        commit('SEARCHED_SIMILAR', {});
        commit('SEARCHED_MESSAGE', '검색 결과가 없습니다.');
      }
    });
  } else {
    commit('SEARCHED_SIMILAR', {});
    commit('SEARCHED_MESSAGE', '검색어는 두 글자 이상 입력해주세요.');
  }
};

const fetchEntry = ({ state, commit }) =>
  new Promise(resolve => {
    const ref = db.ref(`/dict/${state.theDomain}/entries/${state.theEntryId}`);
    ref.once('value', snap => {
      commit('ENTRY', snap.val());
      resolve();
    });
  });

const fetchSynset = ({ state, commit }) =>
  new Promise(resolve => {
    if (state.entry.synOf) {
      const ref = db.ref(
        `/dict/${state.theDomain}/synsets/${state.entry.synOf}`,
      );
      ref.once('value', snap => {
        const synset = snap.val();
        if (synset) {
          commit('SYNSET', synset);
          resolve();
        } else {
          let synset = {};
          synset[state.entry.entryId] = state.entry.orthForm;
          commit('SYNSET', synset);
          resolve();
        }
      });
    } else {
      let synset = {};
      synset[state.entry.entryId] = state.entry.orthForm;
      commit('SYNSET', synset);
      resolve();
    }
  });
const fetchMergingSynset = ({ state, commit }, entryId) =>
  new Promise(resolve => {
    const ref = db.ref(`/dict/${state.theDomain}/entries/${entryId}`);
    ref.once('value').then(entrySnap => {
      const { synOf, orthForm } = entrySnap.val();
      if (synOf) {
        commit('MERGING_SYNSET_ID', synOf);
        db.ref(`/dict/${state.theDomain}/synsets/${synOf}`)
          .once('value')
          .then(synsetSnap => {
            const mergingSynset = synsetSnap.val();
            commit('MERGING_SYNSET', mergingSynset);
            resolve();
          });
      } else {
        commit('MERGING_SYNSET_ID', '');

        let mergingSynset = {};
        mergingSynset[entryId] = orthForm;
        commit('MERGING_SYNSET', mergingSynset);
        resolve();
      }
    });
  });
const updateSynset = ({ state, commit }, mode) =>
  new Promise(resolve => {
    if (mode !== 'delete') {
      commit('SYNSET', { ...state.synset, ...state.mergingSynset });
      commit('HAS_SYNSET', true);
      db.ref(`/dict/${state.theDomain}/lookup/${state.theEntryId}`).update({
        hasSynset: true,
      });
      const synIds = Object.keys(state.synset);
      if (state.mergingSynsetId) {
        synIds.forEach(entryId => {
          db.ref(`/dict/${state.theDomain}/entries/${entryId}`).update({
            synOf: state.mergingSynsetId,
          });
        });
        commit('ENTRY_SYN_OF', state.mergingSynsetId);
        resolve();
      } else {
        if (state.entry.synOf) {
          synIds.forEach(entryId => {
            db.ref(`/dict/${state.theDomain}/entries/${entryId}`).update({
              synOf: state.entry.synOf,
            });
          });
          resolve();
        } else {
          const newSynsetId = db.ref(`/dict/${state.theDomain}/synsets`).push()
            .key;
          synIds.forEach(entryId => {
            db.ref(`/dict/${state.theDomain}/entries/${entryId}`).update({
              synOf: newSynsetId,
            });
          });
          commit('ENTRY_SYN_OF', newSynsetId);
          resolve();
        }
      }
    } else {
      const ref = db.ref(
        `/dict/${state.theDomain}/entries/${state.theEntryId}`,
      );
      ref.update({ synOf: '' });
      commit('ENTRY_SYN_OF', '');
      let synset = {};
      synset[state.entry.entryId] = state.entry.orthForm;
      commit('SYNSET', synset);
      commit('HAS_SYNSET', false);
      db.ref(`/dict/${state.theDomain}/lookup/${state.theEntryId}`).update({
        hasSynset: false,
      });
      resolve();
    }
  });

const fetchIssue = ({ state, commit }) => {
  const ref = db.ref(`/dict/${state.theDomain}/issues/${state.theEntryId}`);
  ref.once('value', snap => {
    if (snap.exists()) {
      const { isImportant, isClosed, messages } = snap.val();
      commit('ISSUE', {
        isImportant: !!isImportant,
        isClosed: !!isClosed,
        messages,
      });
    } else {
      commit('ISSUE', {
        isImportant: false,
        isClosed: false,
        messages: {},
      });
    }
  });
};
const getIssueCode = role => issue => {
  const messages = Object.values(issue.messages);
  const cntMessages = messages.length;
  const lastSender = messages[cntMessages - 1]
    ? messages[cntMessages - 1].sender
    : '';
  const lastSenderCode = role.includes(lastSender);
  if (cntMessages) {
    if (issue.isClosed) {
      return 3;
    } else if (lastSenderCode) {
      return 2;
    } else {
      return 1;
    }
  } else {
    return 0;
  }
};
const pushIssue = ({ state, commit }, { sender, text }) =>
  new Promise(resolve => {
    if (text.replace(/<.+?>/g, '').split('').length > 1) {
      const {
        theDomain,
        theWorksetId,
        theEntryId,
        issue,
        roles,
        entry,
      } = state;
      const { orthForm } = entry;
      const ref = db.ref(`/dict/${theDomain}/issues/${theEntryId}/messages`);
      const newKey = ref.push().key;
      ref.child(newKey).set({ sender, text });
      commit('ISSUE_MESSAGES', { newKey, sender, text });
      const issueProcess = getIssueCode(roles.supervisor)(issue);

      commit('ISSUE_CODE', issueProcess);
      db.ref(
        `/dict/${theDomain}/entryMarkings/${theWorksetId}/${theEntryId}`,
      ).update({ issueProcess });
      db.ref(`/dict/${theDomain}/issues/${theEntryId}`).update({
        issueProcess,
        orthForm,
      });
      resolve();
    }
  });
const onoffIssue = ({ state, commit }, isClosed) =>
  new Promise(resolve => {
    const { theDomain, theWorksetId, theEntryId, issue, roles, entry } = state;
    const { orthForm } = entry;
    if (Object.values(issue.messages > 0)) {
      const ref = db.ref(`/dict/${theDomain}/issues/${theEntryId}`);
      ref.update({ isClosed });
      commit('IS_CLOSED', isClosed);
      const issueProcess = getIssueCode(roles.supervisor)(issue);

      db.ref(
        `/dict/${theDomain}/entryMarkings/${theWorksetId}/${theEntryId}`,
      ).update({ issueProcess });
      db.ref(`/dict/${theDomain}/issues/${theEntryId}`).update({
        issueProcess,
        orthForm,
      });
      commit('ISSUE_CODE', issueProcess);
      resolve();
    }
  });

const changeSkip = ({ commit }, isSkipped) =>
  new Promise(resolve => {
    commit('ENTRY_SKIP', isSkipped);
    resolve();
  });
const changeNeedCheck = ({ commit }, needCheck) =>
  new Promise(resolve => {
    commit('ENTRY_NEED_CHECK', needCheck);
    resolve();
  });
const changePos = ({ commit }, pos) =>
  new Promise(resolve => {
    commit('ENTRY_POS', pos);
    resolve();
  });
const changeSem = ({ commit }, sem) =>
  new Promise(resolve => {
    commit('ENTRY_SEM', sem);
    resolve();
  });
const changeExtraSyns = ({ state, commit }, { syn, type }) =>
  new Promise(resolve => {
    let syns = state.entry.extraSyns ? { ...state.entry.extraSyns } : {};
    if (type !== 'delete') {
      syns[syn] = syn;
      commit('ENTRY_EXTRA_SYNS', syns);
      resolve();
    } else {
      delete syns[syn];
      commit('ENTRY_EXTRA_SYNS', syns);
      resolve();
    }
  });

const updateEntry = ({ state, getters }) =>
  new Promise(resolve => {
    const { isSkipped, needCheck, pos, sem } = state.entry;
    const ref = db.ref(`/dict/${state.theDomain}/entries/${state.theEntryId}`);
    if (getters.semValid) {
      ref.update({
        sem,
        pos,
      });
    }
    ref.update({
      isSkipped,
      needCheck,
      updatedBy: auth.currentUser.email,
      updatedAt: new Date().toLocaleString('ko-KR'),
    });
    resolve();
  });
const updateStageCode = ({ state, commit }, stage) =>
  new Promise(resolve => {
    const { theWorksetId, theEntryId, entry } = state;
    const { pos, sem } = entry;
    commit('STAGE_CODE', stage);
    db.ref(
      `/dict/${state.theDomain}/entryMarkings/${theWorksetId}/${theEntryId}`,
    ).update({ stage });
    const label = `${stage}-${pos}-${sem}`;
    db.ref(`/dict/${state.theDomain}/lookup/${state.theEntryId}`).update({
      label,
    });
    resolve();
  });
const updateExtraSyns = ({ state, commit }) =>
  new Promise(resolve => {
    const { theWorksetId, theEntryId, entry } = state;
    const { extraSyns } = entry;
    const hasExtraSyns = !!(Object.keys(extraSyns) || []).length;
    commit('HAS_EXTRA_SYNS', hasExtraSyns);
    db.ref(
      `/dict/${state.theDomain}/entryMarkings/${theWorksetId}/${theEntryId}`,
    ).update({ hasExtraSyns });
    db.ref(`/dict/${state.theDomain}/lookup/${theEntryId}`).update({
      hasExtraSyns,
    });
    db.ref(`/dict/${state.theDomain}/entries/${theEntryId}`).update({
      extraSyns,
    });
    resolve();
  });

export {
  // common
  changeTheCurrentUser,
  fetchDomainNames,
  fetchUserContext,
  initUserContext,
  fetchUsers,
  fetchRoles, // new
  pickTheUserId,
  pickTheDomain,
  fetchGuide,
  fetchSearchLinks,
  fetchLabels,
  syncSummary,
  markFetchedMain,
  syncWorksets,
  unsyncWorksets,
  pickTheWorksetId,
  initEntryMarkings,
  fetchEntryMarkings,
  pickTheEntryId,
  // entrywork
  fetchSimilars,
  fetchSearchedSimilar,
  fetchEntry,
  fetchSynset,
  fetchMergingSynset,
  fetchIssue,
  updateSynset,
  changeSkip,
  changeNeedCheck,
  changePos,
  changeSem,
  changeExtraSyns,
  updateEntry,
  updateStageCode,
  updateExtraSyns,
  initEntry,
  pushIssue,
  onoffIssue,
};
