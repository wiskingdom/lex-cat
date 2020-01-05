import fireapp from "@/fireapp";

const db = fireapp.database();
const auth = fireapp.auth();

const fetchDomainNames = ({ commit }) =>
  new Promise(resolve => {
    db.ref("/app/domainNames")
      .once("value")
      .then(snap => {
        commit("DOMAIN_NAMES", snap.val());
        resolve();
      });
  });

const pickTheDomain = ({ commit }, domainName) =>
  new Promise(resolve => {
    commit("THE_DOMAIN", domainName);
    resolve();
  });

const fetchUsers = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/app/users/${state.theDomain}`)
      .once("value")
      .then(snap => {
        commit("USERS", snap.val());
        resolve();
      });
  });

const fetchLabels = ({ state, commit }) =>
  new Promise(resolve => {
    db.ref(`/app/labels/${state.theDomain}`)
      .once("value")
      .then(snap => {
        commit("LABELS", snap.val());
        resolve();
      });
  });

const syncSummary = ({ state, commit }) => {
  const ref = db.ref(`/dict/${state.theDomain}/summary`);
  ref.on("value", snap => {
    commit("SUMMARY", { snap: snap.val(), ref });
  });
};
const syncWorksetStates = ({ state, commit }) => {
  const ref = db
    .ref(`/dict/${state.theDomain}/worksetStates`)
    .orderByChild("userId")
    .equalTo(auth.currentUser.email);
  ref.on("value", snap => {
    commit("WORKSET_STATES", { snap: snap.val(), ref });
  });
};

const pickTheWorksetId = ({ commit }, worksetId) =>
  new Promise(resolve => {
    commit("THE_WORKSET_ID", worksetId);
    resolve();
  });

const syncEntryStates = ({ state, commit }) => {
  const ref = db.ref(
    `/dict/${state.theDomain}/entryStates/${state.theWorksetId}`
  );
  ref.on("value", snap => {
    commit("ENTRY_STATES", { snap: snap.val(), ref });
  });
};

const pickTheEntryId = ({ commit }, entryId) =>
  new Promise(resolve => {
    commit("THE_ENTRY_ID", entryId);
    resolve();
  });

const getSuperEntryId = entryId =>
  entryId
    .split("-")
    .slice(0, 3)
    .join("-");
const fetchSuperEntry = ({ state, commit }) => {
  const theSuperEntryId = getSuperEntryId(state.theEntryId);
  const ref = db.ref(
    `/dict/${state.theDomain}/superEntries/${theSuperEntryId}`
  );
  ref.once("value", snap => {
    commit("SUPER_ENTRY", snap.val());
  });
};

const fetchSimilars = ({ state, commit }) => {
  const ref = db.ref(`/dict/${state.theDomain}/similars`);
  ref.once("value", snap => {
    commit("SIMILARS", snap.val());
  });
};

const fetchSearchedSimilar = ({ state, commit }, string) => {
  const indexString = string.replace(/ /g, "");
  const ref = db
    .ref(`/dict/${state.theDomain}/superEntries`)
    .orderByChild("indexForm")
    .equalTo(indexString)
    .limitToFirst(1);
  ref.once("value").then(snap => {
    if (snap.exists()) {
      const theValue = snap.val();
      const theSuperEntryId = Object.keys(theValue)[0];
      const { orthForm } = theValue[theSuperEntryId];
      let similar = {};
      const entryId = `${theSuperEntryId}-01`;
      similar[entryId] = orthForm;
      commit("SEARCHED_SIMILAR", similar);
    } else {
      commit("SEARCHED_SIMILAR", {});
    }
  });
};

const fetchEntry = ({ state, commit }) =>
  new Promise(resolve => {
    const ref = db.ref(`/dict/${state.theDomain}/entries/${state.theEntryId}`);
    ref.once("value", snap => {
      commit("ENTRY", snap.val());
      resolve();
    });
  });

const syncSynset = ({ state, commit }) => {
  const ref = db.ref(`/dict/${state.theDomain}/synsets/${state.entry.synset}`);
  ref.on("value", snap => {
    commit("SYNSET", { snap: snap.val(), ref });
  });
};
const fetchMergingSynset = ({ state, commit }, entryId) => {
  const ref = db.ref(`/dict/${state.theDomain}/entries/${entryId}`);
  ref.once("value").then(entrySnap => {
    const { synset } = entrySnap.val();
    if (synset) {
      commit("MERGING_SYNSET_ID", synset);
      db.ref(`/dict/${state.theDomain}/synsets/${synset}`)
        .once("value")
        .then(synsetSnap => {
          commit("MERGING_SYNSET", synsetSnap.val());
        });
    } else {
      commit("MERGING_SYNSET_ID", entryId);
      const theSuperEntryId = getSuperEntryId(entryId);
      db.ref(`/dict/${state.theDomain}/superEntries/${theSuperEntryId}`)
        .once("value")
        .then(superSnap => {
          const { freq } = superSnap.val();
          let mergingSynset = {};
          mergingSynset[entryId] = freq;
          commit("MERGING_SYNSET", mergingSynset);
        });
    }
  });
};
const updateSynset = ({ state, commit }, mode) =>
  new Promise(resolve => {
    const mergeSyns = Object.keys(state.mergingSynset);
    const mergingSynsetSize = mergeSyns.length;
    if (mode !== "delete") {
      if (state.entry.synset) {
        const syns = Object.keys(state.synset);
        const synsetSize = syns.length;
        if (synsetSize + 1 >= mergingSynsetSize) {
          mergeSyns.forEach(entryId => {
            db.ref(`/dict/${state.theDomain}/entries/${entryId}`).update({
              synset: state.entry.synset
            });
          });
        } else {
          syns.forEach(entryId => {
            db.ref(`/dict/${state.theDomain}/entries/${entryId}`).update({
              synset: state.mergingSynsetId
            });
          });
          mergeSyns.forEach(entryId => {
            db.ref(`/dict/${state.theDomain}/entries/${entryId}`).update({
              synset: state.mergingSynsetId
            });
          });
          commit("ENTRY_SYNSET", state.mergingSynsetId);
        }
      } else {
        const ref = db.ref(
          `/dict/${state.theDomain}/entries/${state.theEntryId}`
        );
        ref.update({ synset: state.mergingSynsetId });
        mergeSyns.forEach(entryId => {
          db.ref(`/dict/${state.theDomain}/entries/${entryId}`).update({
            synset: state.mergingSynsetId
          });
        });
        commit("ENTRY_SYNSET", state.mergingSynsetId);
      }
    } else {
      const ref = db.ref(
        `/dict/${state.theDomain}/entries/${state.theEntryId}`
      );
      ref.update({ synset: "" });
      commit("ENTRY_SYNSET", "");
    }
    resolve();
  });

const fetchIssue = ({ state, commit }) => {
  const ref = db.ref(`/dict/${state.theDomain}/issues/${state.theEntryId}`);
  ref.once("value", snap => {
    commit("ISSUE", snap.val());
  });
};

const changeSkip = ({ commit }, isSkipped) =>
  new Promise(resolve => {
    commit("ENTRY_SKIP", isSkipped);
    resolve();
  });
const changeNeedCheck = ({ commit }, needCheck) =>
  new Promise(resolve => {
    commit("ENTRY_SKIP", needCheck);
    resolve();
  });
const changePos = ({ commit }, pos) =>
  new Promise(resolve => {
    commit("ENTRY_SKIP", pos);
    resolve();
  });
const changeSem = ({ commit }, sem) =>
  new Promise(resolve => {
    commit("ENTRY_SKIP", sem);
    resolve();
  });

const updateEntryLabels = ({ state, commit }) => {
  const { isSkipped, needCheck, pos, sem } = state.entry;
  const ref = db.ref(`/dict/${state.theDomain}/entries/${state.theEntryId}`);
  ref.update({
    isSkipped,
    needCheck,
    pos,
    sem,
    updatedBy: auth.currentUser.email
  });
  commit("ENTRY_SYNSET", "");
};

export {
  fetchDomainNames,
  pickTheDomain,
  fetchUsers,
  fetchLabels,
  syncSummary,
  syncWorksetStates,
  pickTheWorksetId,
  syncEntryStates,
  pickTheEntryId,
  fetchSuperEntry,
  fetchSimilars,
  fetchSearchedSimilar,
  fetchEntry,
  syncSynset,
  fetchMergingSynset,
  fetchIssue,
  updateSynset,
  changeSkip,
  changeNeedCheck,
  changePos,
  changeSem,
  updateEntryLabels
};
