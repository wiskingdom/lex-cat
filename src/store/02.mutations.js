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

const SUMMARY = (state, payload) => {
  state.summary = payload;
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

const STAGE_CODE = (state, payload) => {
  state.entryStates[state.theEntryId].stage = payload;
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
  state.synset = payload;
};
const SYNS = (state, payload) => {
  state.syns = payload;
};
const MERGING_SYNSET = (state, payload) => {
  state.mergingSynset = payload;
};
const MERGING_SYNS = (state, payload) => {
  state.mergingSyns = payload;
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
  MERGING_SYNS,
  MERGING_SYNSET_ID,
  ISSUE,
  SYNS,
  STAGE_CODE,
};
