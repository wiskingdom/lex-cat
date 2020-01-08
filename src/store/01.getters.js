// for main layout
const defaultDomain = state => state.userContext.default;
const worksets = state => {
  if (!state.worksetStates) {
    return [];
  }
  return Object.entries(state.worksetStates).map(([label, features]) => {
    const value = label;
    const { cntCompletes, cntEntries, cntOpenIssues } = features;
    const rate = `${cntCompletes}/${cntEntries}`;
    const allComplete = cntCompletes === cntEntries;
    return { label, value, rate, allComplete, cntOpenIssues };
  });
};
const entryIndex = state => {
  if (!state.entryStates) {
    return [];
  }
  return Object.entries(state.entryStates).map(([value, features]) => {
    const { hasSynset, issueProcess, stage, orthForm } = features;
    const label = orthForm;
    const getStageText = stageCode => {
      if (stageCode === 0) {
        return '대기';
      } else if (stageCode === 3) {
        return '등재';
      } else if (stageCode === 2) {
        return '미등재';
      } else {
        return '보류';
      }
    };
    const getStageColor = stageCode => {
      if (stageCode === 0) {
        return 'grey-5';
      } else if (stageCode === 3) {
        return 'positive';
      } else if (stageCode === 2) {
        return 'dark';
      } else {
        return 'warning';
      }
    };
    const stageText = getStageText(stage);
    const stageColor = getStageColor(stage);
    return { label, value, stageColor, stageText, hasSynset, issueProcess };
  });
};
const theSuperEntryId = state =>
  state.theEntryId
    .split('-')
    .slice(0, 3)
    .join('-');
const theSuperNum = state => state.theEntryId.split('-').slice(2, 3)[0];
const prevSuperNum = (state, getters) => {
  const prevNum = Number(getters.theSuperNum) - 1;
  return `${prevNum}`.padStart(2, '0');
};
const nextSuperNum = (state, getters) => {
  const nextNum = Number(getters.theSuperNum) + 1;
  return `${nextNum}`.padStart(2, '0');
};
//
const lastEntryId = (state, getters) =>
  `${getters.entryIndex.length + 1}`.padStart(2, '0');
const isPos = state => tag => state.entry.pos === tag;
const isSem = state => tag => state.entry.sem === tag;
const currentSemTag = state => {
  const value = state.entry.sem;
  const tag = state.labels.sem[value];
  if (!value) {
    return { value, tag: '미분류' };
  }
  return { value, tag };
};
//
const semHints = state => {
  const { sem } = state.entry;
  const semCods = Object.entries(state.labels.sem).map(([value, tag]) => ({
    value,
    tag: `[${value}]\n${tag}`,
  }));
  const semReg = new RegExp(`^${sem}\\d$`);
  return semCods.filter(item => item.value.match(semReg));
};
const semValid = state => {
  const pos = state.entry.pos ? state.entry.pos : 'any';
  return state.labels.posSemValid[pos].includes(state.entry.sem);
};
const semIsIn = state => {
  return Object.keys(state.labels.sem).includes(state.entry.sem);
};
const synsetList = state => Object.keys(state.synset);
const isSynMember = state => key => {
  const synset = state.synset ? state.synset : {};
  return !!synset[key];
};
const stageCode = (state, getters) => {
  const getEntryStage = (isSkipped, needCheck, pos, sem) => {
    if (needCheck) {
      return 1;
    } else if (!isSkipped && pos && sem && getters.semValid) {
      return 3;
    } else if (isSkipped) {
      return 2;
    } else {
      return 0;
    }
  };
  const { isSkipped, needCheck, pos, sem } = state.entry;
  return getEntryStage(isSkipped, needCheck, pos, sem);
};
export {
  defaultDomain,
  worksets,
  entryIndex,
  theSuperEntryId,
  theSuperNum,
  prevSuperNum,
  nextSuperNum,
  lastEntryId,
  isPos,
  currentSemTag,
  semHints,
  isSem,
  semValid,
  semIsIn,
  synsetList,
  isSynMember,
  stageCode,
};
