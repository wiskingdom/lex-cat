export default {
  // meta
  domainNames: [],
  userContext: {
    default: '',
    role: 'annotator',
  },
  theDomain: '',
  users: [],
  theUserId: '',
  refs: {},
  // entrywork
  labels: {
    pos: {},
    sem: {},
    posSemRes: {},
    semTerminals: [],
  },
  summary: {
    all: {},
    users: {},
  },
  worksetStates: {},
  theWorksetId: '',
  entryStates: {},
  theEntryId: '',
  superEntry: {},
  similars: {},
  searchedSimilar: {},
  entry: {
    isSkipped: false,
    needCheck: false,
    pos: '',
    sem: '',
    synset: '',
    updatedBy: '',
  },
  synset: {},
  syns: [],
  mergingSynset: {},
  mergingSynsetId: '',
  issue: {},
};
