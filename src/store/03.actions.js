import fireapp from '@/fireapp';

const db = fireapp.database();
// const auth = fireapp.auth();

const fetchDomainNames = ({ commit }) =>
  new Promise(resolve => {
    db.ref('/app/domainNames')
      .once('value')
      .then(snap => {
        commit('DOMAIN_NAMES', snap.val());
        resolve();
      });
  });

const pickTheDomain = ({ commit }, domainName) => {
  commit('THE_DOC_FOLDER', domainName);
};

const fetchUsers = ({ commit }) =>
  new Promise(resolve => {
    db.ref('/app/users')
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

const syncSummary = ({ state, commit }) => {
  state.refs.summary = db.ref(`/dict/${state.theDomain}/summary`);
  state.refs.summary.on('value', snap => {
    commit('SUMMARY', snap.val());
  });
};
const fetchWorksetStates = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${state.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const pickTheWorksetId = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${state.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchEntryStates = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${state.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const pickTheEntryId = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${state.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchSuperEntry = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${state.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchSimilars = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${state.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchSearchedSimilars = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${state.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchEntry = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${state.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchSynset = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${state.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchIssue = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${state.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

export {
  fetchDomainNames,
  pickTheDomain,
  fetchUsers,
  fetchLabels,
  syncSummary,
  fetchWorksetStates,
  pickTheWorksetId,
  fetchEntryStates,
  pickTheEntryId,
  fetchSuperEntry,
  fetchSimilars,
  fetchSearchedSimilars,
  fetchEntry,
  fetchSynset,
  fetchIssue,
};
