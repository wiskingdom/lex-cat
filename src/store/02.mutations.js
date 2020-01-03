const DOMAIN_NAMES = (state, payload) => {
  state.domainNames = payload;
};
const THE_DOMAIN = (state, payload) => {
  state.theDomain = payload;
};
const USERS = (state, payload) => {
  state.users = payload;
};

const LABELS = (state, payload) => {
  state.labels = payload;
};

const SUMMARY = (state, { snap, ref }) => {
  state.refs.summary = ref;
  state.summary = snap;
};
const WORKSET_STATES = (state, payload) => {
  state.worksetStates = payload;
};
const THE_WORKSET_ID = (state, payload) => {
  state.theWorksetId = payload;
};
const ENTRY_STATES = (state, payload) => {
  state.entryStates = payload;
};
const THE_ENTRY_ID = (state, payload) => {
  state.theEntryId = payload;
};
const SUPER_ENTRY = (state, payload) => {
  state.superEntry = payload;
};
const SIMILARS = (state, payload) => {
  state.similars = payload;
};
const SEARCHED_SIMILARS = (state, payload) => {
  state.searchedSimilars = payload;
};
const ENTRY = (state, payload) => {
  state.entry = payload;
};
const SYNSET = (state, payload) => {
  state.synset = payload;
};
const ISSUE = (state, payload) => {
  state.issue = payload;
};

export {
  DOMAIN_NAMES,
  THE_DOMAIN,
  USERS,
  LABELS,
  SUMMARY,
  WORKSET_STATES,
  THE_WORKSET_ID,
  ENTRY_STATES,
  THE_ENTRY_ID,
  SUPER_ENTRY,
  SIMILARS,
  SEARCHED_SIMILARS,
  SYNSET,
  ENTRY,
  ISSUE,
};
