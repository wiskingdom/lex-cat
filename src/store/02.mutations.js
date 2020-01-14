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
const WORKSETS = (state, payload) => {
  state.worksets = payload;
};
const THE_WORKSET_ID = (state, payload) => {
  state.theWorksetId = payload;
};
const ENTRY_MARKINGS = (state, payload) => {
  state.entryMarkings = payload;
};

const STAGE_CODE = (state, payload) => {
  state.entryMarkings[state.theEntryId].stage = payload;
};
const THE_ENTRY_ID = (state, payload) => {
  state.theEntryId = payload;
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
const ENTRY_SYN_OF = (state, payload) => {
  state.entry.synOf = payload;
};
const ENTRY_EXTRA_SYNS = (state, payload) => {
  state.entry.extraSyns = payload;
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
const MERGING_SYNSET = (state, payload) => {
  state.mergingSynset = payload;
};
const MERGING_SYNSET_ID = (state, payload) => {
  state.mergingSynsetId = payload;
};
const ISSUE = (state, payload) => {
  state.issue = payload;
};
const HAS_SYNSET = (state, payload) => {
  state.entryMarkings[state.theEntryId].hasSynset = payload;
};
const HAS_EXTRA_SYNS = (state, payload) => {
  state.entryMarkings[state.theEntryId].hasExtraSyns = payload;
};
const ISSUE_MESSAGES = (state, { sender, text }) => {
  state.issue.messages.push({ sender, text });
};

export {
  DOMAIN_NAMES,
  USER_CONTEXT,
  THE_DOMAIN,
  USERS,
  THE_USER_ID,
  LABELS,
  SUMMARY,
  WORKSETS,
  THE_WORKSET_ID,
  ENTRY_MARKINGS,
  THE_ENTRY_ID,
  SIMILARS,
  SEARCHED_SIMILAR,
  ENTRY,
  ENTRY_SYN_OF,
  ENTRY_EXTRA_SYNS,
  ENTRY_SKIP,
  ENTRY_NEED_CHECK,
  ENTRY_POS,
  ENTRY_SEM,
  SYNSET,
  MERGING_SYNSET,
  MERGING_SYNSET_ID,
  ISSUE,
  STAGE_CODE,
  HAS_SYNSET,
  HAS_EXTRA_SYNS,
  ISSUE_MESSAGES,
};
