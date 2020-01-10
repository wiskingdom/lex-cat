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

const fetchLabels = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/app/labels/${state.theDomain}`)
      .once('value')
      .then(snap => {
        commit('LABELS', snap.val());
        resolve();
      });
  });

const syncWorksetStates = ({ state, commit }) => {
  const ref = db
    .ref(`/dict/${state.theDomain}/worksetStates`)
    .orderByChild('userId')
    .equalTo(state.theUserId);
  ref.on('value', snap => {
    commit('WORKSET_STATES', snap.val());
  });
};

const pickTheWorksetId = ({ commit }, worksetId) =>
  new Promise(resolve => {
    commit('THE_WORKSET_ID', worksetId);
    resolve();
  });

const initEntryStates = ({ commit }) => {
  commit('ENTRY_STATES', {});
};
const syncEntryStates = ({ state, commit }) => {
  const ref = db.ref(
    `/dict/${state.theDomain}/entryStates/${state.theWorksetId}`,
  );
  ref.once('value', snap => {
    commit('ENTRY_STATES', snap.val());
  });
};
const changeStageCode = ({ commit }, payload) =>
  new Promise(resolve => {
    commit('STAGE_CODE', payload);
    resolve();
  });
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
  commit('SUPER_ENTRY', {});
  commit('SIMILARS', {});
  commit('ENTRY', {});
  commit('SYNS', []);
  commit('SYNSET', {});
  commit('ISSUE', {});
};
const getSuperEntryId = entryId =>
  entryId
    .split('-')
    .slice(0, 3)
    .join('-');
const fetchSuperEntry = ({ state, commit }) => {
  const theSuperEntryId = getSuperEntryId(state.theEntryId);
  const ref = db.ref(
    `/dict/${state.theDomain}/superEntries/${theSuperEntryId}`,
  );
  ref.once('value', snap => {
    commit('SUPER_ENTRY', snap.val());
  });
};

const fetchSimilars = ({ state, commit }) => {
  const ref = db.ref(`/dict/${state.theDomain}/similars`);
  ref.once('value', snap => {
    commit('SIMILARS', snap.val());
  });
};

const fetchSearchedSimilar = ({ state, commit }, string) => {
  if (string) {
    const indexString = string.replace(/ /g, '');
    const ref = db
      .ref(`/dict/${state.theDomain}/superEntries`)
      .orderByChild('indexForm')
      .startAt(indexString)
      .endAt(`${indexString}\uf8ff")`);
    ref.once('value').then(snap => {
      if (snap.exists()) {
        const theValue = snap.val();
        const theSuperEntryIds = Object.keys(theValue);
        let similar = {};
        theSuperEntryIds.forEach(superId => {
          similar[superId] = theValue[superId].orthForm;
        });
        commit('SEARCHED_SIMILAR', similar);
      } else {
        commit('SEARCHED_SIMILAR', {});
      }
    });
  } else {
    commit('SEARCHED_SIMILAR', {});
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
    if (state.entry.synset) {
      const ref = db.ref(
        `/dict/${state.theDomain}/synsets/${state.entry.synset}`,
      );
      ref.once('value', snap => {
        const synset = snap.val();
        if (synset) {
          commit('SYNSET', synset);
          let syns = [];
          Object.keys(synset).forEach(entryId => {
            db.ref(`/dict/${state.theDomain}/entries/${entryId}`).once(
              'value',
              synSnap => {
                syns.push(synSnap.val().orthForm);
              },
            );
          });
          commit('SYNS', syns);
          resolve();
        } else {
          commit('SYNS', []);
          commit('SYNSET', {});
          resolve();
        }
      });
    } else {
      commit('SYNS', []);
      commit('SYNSET', {});
      resolve();
    }
  });
const fetchMergingSynset = ({ state, commit }, entryId) =>
  new Promise(resolve => {
    const ref = db.ref(`/dict/${state.theDomain}/entries/${entryId}`);
    ref.once('value').then(entrySnap => {
      const { synset } = entrySnap.val();
      if (synset) {
        commit('MERGING_SYNSET_ID', synset);
        db.ref(`/dict/${state.theDomain}/synsets/${synset}`)
          .once('value')
          .then(synsetSnap => {
            const mergingSynset = synsetSnap.val();
            commit('MERGING_SYNSET', mergingSynset);
            if (mergingSynset) {
              let syns = [];
              Object.keys(mergingSynset).forEach(mEntryId => {
                db.ref(`/dict/${state.theDomain}/entries/${mEntryId}`).once(
                  'value',
                  synSnap => {
                    syns.push(synSnap.val().orthForm);
                  },
                );
              });
              commit('MERGING_SYNS', syns);
              resolve();
            } else {
              resolve();
            }
          });
      } else {
        commit('MERGING_SYNSET_ID', entryId);
        const theSuperEntryId = getSuperEntryId(entryId);
        db.ref(`/dict/${state.theDomain}/superEntries/${theSuperEntryId}`)
          .once('value')
          .then(superSnap => {
            const { freq, orthForm } = superSnap.val();
            let mergingSynset = {};
            mergingSynset[entryId] = freq;
            commit('MERGING_SYNSET', mergingSynset);
            commit('MERGING_SYNS', [orthForm]);
            resolve();
          });
      }
    });
  });
const updateSynset = ({ state, commit }, mode) =>
  new Promise(resolve => {
    const mergeSyns = Object.keys(state.mergingSynset);
    const mergingSynsetSize = mergeSyns.length;
    if (mode !== 'delete') {
      if (state.entry.synset) {
        commit('SYNS', [...state.syns, ...state.mergingSyns]);
        commit('SYNSET', { ...state.syns, ...state.mergingSynset });
        const syns = Object.keys(state.synset);
        const synsetSize = syns.length;
        if (synsetSize + 1 >= mergingSynsetSize) {
          mergeSyns.forEach(entryId => {
            db.ref(`/dict/${state.theDomain}/entries/${entryId}`).update({
              synset: state.entry.synset,
            });
          });
        } else {
          syns.forEach(entryId => {
            db.ref(`/dict/${state.theDomain}/entries/${entryId}`).update({
              synset: state.mergingSynsetId,
            });
          });
          mergeSyns.forEach(entryId => {
            db.ref(`/dict/${state.theDomain}/entries/${entryId}`).update({
              synset: state.mergingSynsetId,
            });
          });
          commit('ENTRY_SYNSET', state.mergingSynsetId);
        }
      } else {
        const syns = {};
        syns[state.theEntryId] = state.entry.orthForm;
        commit('SYNS', [state.entry.orthForm, ...state.mergingSyns]);
        commit('SYNSET', { ...syns, ...state.mergingSynset });
        const ref = db.ref(
          `/dict/${state.theDomain}/entries/${state.theEntryId}`,
        );
        ref.update({ synset: state.mergingSynsetId });
        mergeSyns.forEach(entryId => {
          db.ref(`/dict/${state.theDomain}/entries/${entryId}`).update({
            synset: state.mergingSynsetId,
          });
        });
        commit('ENTRY_SYNSET', state.mergingSynsetId);
      }
    } else {
      const ref = db.ref(
        `/dict/${state.theDomain}/entries/${state.theEntryId}`,
      );
      ref.update({ synset: '' });
      commit('ENTRY_SYNSET', '');
      commit('SYNS', []);
      commit('SYNSET', {});
    }
    resolve();
  });

const fetchIssue = ({ state, commit }) => {
  const ref = db.ref(`/dict/${state.theDomain}/issues/${state.theEntryId}`);
  ref.once('value', snap => {
    commit('ISSUE', snap.val());
  });
};

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

const updateEntryLabels = ({ state, getters }) =>
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
    });
    resolve();
  });

export {
  fetchDomainNames,
  fetchUserContext,
  fetchUsers,
  pickTheUserId,
  pickTheDomain,
  fetchLabels,
  syncSummary,
  syncWorksetStates,
  pickTheWorksetId,
  initEntryStates,
  syncEntryStates,
  pickTheEntryId,
  fetchSuperEntry,
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
  updateEntryLabels,
  changeStageCode,
  initEntry,
};
