const DOMAIN_NAMES = (state, payload) => {
  state.domainNames = payload;
};
const USER_CONTEXT = (state, payload) => {
  state.userContext = payload;
};
const THE_DOMAIN = (state, payload) => {
  state.theDomain = payload;
};
const USERS = (state, payload) => {
  state.users = payload;
};
const THE_USER_ID = (state, payload) => {
  state.theUserId = payload;
};
const LABELS = (state, payload) => {
  state.labels = payload;
};

const SUMMARY = (state, { snap }) => {
  // state.refs.summary = ref;
  state.summary = snap;
};
const WORKSET_STATES = (state, { snap }) => {
  // state.refs.worksetStates = ref;
  state.worksetStates = snap;
};
const THE_WORKSET_ID = (state, payload) => {
  state.theWorksetId = payload;
};
const ENTRY_STATES = (state, { snap }) => {
  //  state.refs.entryStates = ref;
  state.entryStates = snap;
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
const SEARCHED_SIMILAR = (state, payload) => {
  state.searchedSimilar = payload;
};
const ENTRY = (state, payload) => {
  state.entry = payload;
};

const ENTRY_SYNSET = (state, payload) => {
  state.entry.synset = payload;
};
const ENTRY_SKIP = (state, payload) => {
  state.entry.isSkipped = payload;
};
const ENTRY_NEED_CHECK = (state, payload) => {
  state.entry.needCheck = payload;
};
const ENTRY_POS = (state, payload) => {
  state.entry.pos = payload;
};
const ENTRY_SEM = (state, payload) => {
  state.entry.sem = payload;
};
const SYNSET = (state, payload) => {
  // state.refs.synset = ref;
  state.synset = payload;
};
const SYNS = (state, payload) => {
  state.syns = payload;
};
const MERGING_SYNSET = (state, payload) => {
  state.mergingSynset = payload;
};
const MERGING_SYNSET_ID = (state, payload) => {
  state.mergingSynsetId = payload;
};
const ISSUE = (state, payload) => {
  state.issue = payload;
};

export {
  DOMAIN_NAMES,
  USER_CONTEXT,
  THE_DOMAIN,
  USERS,
  THE_USER_ID,
  LABELS,
  SUMMARY,
  WORKSET_STATES,
  THE_WORKSET_ID,
  ENTRY_STATES,
  THE_ENTRY_ID,
  SUPER_ENTRY,
  SIMILARS,
  SEARCHED_SIMILAR,
  ENTRY,
  ENTRY_SYNSET,
  ENTRY_SKIP,
  ENTRY_NEED_CHECK,
  ENTRY_POS,
  ENTRY_SEM,
  SYNSET,
  MERGING_SYNSET,
  MERGING_SYNSET_ID,
  ISSUE,
  SYNS,
};
