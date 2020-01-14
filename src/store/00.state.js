export default {
  // meta
  domainNames: [],
  userContext: {
    default: '',
    role: 'annotator',
    code: 0,
  },
  theDomain: '',
  users: [],
  theUserId: '',
  // entrywork
  labels: {
    pos: {},
    sem: {},
    posSemValid: {},
  },
  summary: {
    all: {},
    users: {},
  },
  worksets: {},
  theWorksetId: '',
  entryMarkings: {},
  theEntryId: '',
  similars: {},
  searchedSimilar: {},
  entry: {
    orthForm: '',
    domain: '',
    sourcedFrom: '',
    description: '',
    isSkipped: false,
    needCheck: false,
    pos: '',
    sem: '',
    synOf: '',
    extraSyns: {},
    updatedBy: '',
  },
  synset: {},
  mergingSynset: {},
  mergingSynsetId: '',
  issue: {
    isImportant: false,
    messages: [],
  },
};
