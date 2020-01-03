import fireapp from '@/fireapp';

const db = fireapp.database();
// const auth = fireapp.auth();

const fetchDomainNames = ({ getters, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${getters.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const pickTheDomain = ({ getters, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${getters.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchUsers = ({ getters, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${getters.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchLabels = ({ getters, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${getters.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchSummary = ({ getters, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${getters.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchWorksetStates = ({ getters, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${getters.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const pickTheWorksetId = ({ getters, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${getters.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchEntryStates = ({ getters, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${getters.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const pickTheEntryId = ({ getters, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${getters.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchSuperEntry = ({ getters, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${getters.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchSimilars = ({ getters, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${getters.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchSearchedSimilars = ({ getters, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${getters.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchEntry = ({ getters, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${getters.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchSynset = ({ getters, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${getters.theDomain}/entryStates`)
      .once('value')
      .then(snap => {
        commit('ENTRY_STATES', snap.val());
        resolve();
      });
  });

const fetchIssue = ({ getters, commit }) =>
  new Promise(resolve => {
    db.ref(`/dict/${getters.theDomain}/entryStates`)
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
  fetchSummary,
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
