import fireapp from '@/fireapp';

const db = fireapp.database();
const auth = fireapp.auth();

const fetchDomainNames = ({ commit }) =>
  new Promise(resolve => {
    db.ref('/app/domainNames')
      .once('value')
      .then(snap => {
        commit('DOMAIN_NAMES', snap.val());
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

const fetchLabels = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/app/labels/${state.theDomain}`)
      .once('value')
      .then(snap => {
        commit('LABELS', snap.val());
        resolve();
      });
  });

const syncWorksets = ({ state, commit }) => {
  const annotatorCode = state.users.indexOf(state.theUserId);
  const ref = db
    .ref(`/dict/${state.theDomain}/worksets`)
    .orderByChild('annotatorCode')
    .equalTo(annotatorCode);
  ref.on('value', snap => {
    commit('WORKSETS', snap.val());
  });
};

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
  commit('ENTRY', {});
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
          similar[entryId] = theValue[entryId].orthForm;
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
      if (state.mergingSynsetId) {
        if (state.entry.synOf) {
          const synIds = Object.keys(state.synset);
          synIds.forEach(entryId => {
            db.ref(`/dict/${state.theDomain}/entries/${entryId}`).update({
              synOf: state.mergingSynsetId,
            });
          });
          resolve();
        } else {
          db.ref(`/dict/${state.theDomain}/entries/${state.theEntryId}`).update(
            {
              synOf: state.mergingSynsetId,
            },
          );
          resolve();
        }
      } else {
        if (state.entry.synOf) {
          const mergSynIds = Object.keys(state.mergingSynset);
          mergSynIds.forEach(entryId => {
            db.ref(`/dict/${state.theDomain}/entries/${entryId}`).update({
              synOf: state.entry.synOf,
            });
          });
          resolve();
        } else {
          const newSynsetId = db.ref(`/dict/${state.theDomain}/synsets`).push()
            .key;
          db.ref(`/dict/${state.theDomain}/entries/${state.theEntryId}`).update(
            {
              synOf: newSynsetId,
            },
          );
          const mergSynIds = Object.keys(state.mergingSynset);
          mergSynIds.forEach(entryId => {
            db.ref(`/dict/${state.theDomain}/entries/${entryId}`).update({
              synOf: newSynsetId,
            });
          });
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
    if (text.split('').length > 4) {
      const { theDomain, theWorksetId, theEntryId, issue, roles } = state;
      const ref = db.ref(`/dict/${theDomain}/issues/${theEntryId}/messages`);
      const newKey = ref.push().key;
      ref.child(newKey).set({ sender, text });
      commit('ISSUE_MESSAGES', { newKey, sender, text });
      const issueProcess = getIssueCode(roles.supervisor)(issue);

      commit('ISSUE_CODE', issueProcess);
      db.ref(
        `/dict/${theDomain}/entryMarkings/${theWorksetId}/${theEntryId}`,
      ).update({ issueProcess });
      resolve();
    }
  });
const onoffIssue = ({ state, commit }, isClosed) =>
  new Promise(resolve => {
    const { theDomain, theWorksetId, theEntryId, issue, roles } = state;
    if (Object.values(issue.messages > 0)) {
      const ref = db.ref(`/dict/${theDomain}/issues/${theEntryId}`);
      ref.update({ isClosed });
      commit('IS_CLOSED', isClosed);
      const issueProcess = getIssueCode(roles.supervisor)(issue);

      db.ref(
        `/dict/${theDomain}/entryMarkings/${theWorksetId}/${theEntryId}`,
      ).update({ issueProcess });
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
    const { isSkipped, needCheck, pos, sem, extraSyns } = state.entry;
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
      extraSyns,
      updatedBy: auth.currentUser.email,
    });
    resolve();
  });
const updateStageCode = ({ state, commit }, stage) =>
  new Promise(resolve => {
    const { theWorksetId, theEntryId } = state;
    commit('STAGE_CODE', stage);
    db.ref(
      `/dict/${state.theDomain}/entryMarkings/${theWorksetId}/${theEntryId}`,
    ).update({ stage });
    resolve();
  });
const updateHasExtraSyns = ({ state, commit }) =>
  new Promise(resolve => {
    const { theWorksetId, theEntryId, entry } = state;
    const { extraSyns } = entry;
    const hasExtraSyns = !!(Object.keys(extraSyns) || []).length;
    commit('HAS_EXTRA_SYNS', hasExtraSyns);
    db.ref(
      `/dict/${state.theDomain}/entryMarkings/${theWorksetId}/${theEntryId}`,
    ).update({ hasExtraSyns });
    resolve();
  });

export {
  // common
  fetchDomainNames,
  fetchUserContext,
  fetchUsers,
  fetchRoles, // new
  pickTheUserId,
  pickTheDomain,
  fetchLabels,
  syncSummary,
  syncWorksets,
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
  updateHasExtraSyns,
  initEntry,
  pushIssue,
  onoffIssue,
};
