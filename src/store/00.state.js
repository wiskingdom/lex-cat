export default {
  // meta
  theCurrentUser: {
    email: '',
  },
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
  // issue tool
  theIssueCode: '',
  issueMarkings: {},
};
