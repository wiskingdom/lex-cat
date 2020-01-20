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
  roles: {
    supervisor: [''],
  },
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
  worksetsRef: '',
  theWorksetId: '',
  entryMarkings: {},
  theEntryId: '',
  similars: {},
  searchedSimilar: {},
  searchedMessage: '',
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
    isClosed: false,
    messages: [],
  },
};
