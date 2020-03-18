export default {
  // meta
  theCurrentUser: {
    email: '',
  },
  domainNames: [],
  domainCodeMap: {},
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
  // main tool
  labels: {
    pos: {},
    sem: {},
    posSemValid: {},
  },
  guide: {
    name: '',
    path: '',
  },
  searchLinks: [],
  summary: {
    all: {},
    users: {},
  },
  worksets: {},
  worksetsRef: '',
  theWorksetId: '',
  entryMarkings: {},
  fetchedMain: false,
  // entry
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
    messages: {},
  },
  // ses (search & edit synset) tool
  seSynset: '',
  seSynsetMessage: '',
  members: {},
  fetchedSes: false,
};
