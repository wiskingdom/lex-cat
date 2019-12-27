const THE_ENTRY_ID = (state, payload) => {
	state.theEntryId = payload;
};

const ENTRY_STATES = (state, payload) => {
	state.entryStates = payload;
};

export { THE_ENTRY_ID, ENTRY_STATES };
