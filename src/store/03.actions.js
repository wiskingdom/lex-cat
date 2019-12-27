import fireapp from '@/fireapp';

const db = fireapp.database();
// const auth = fireapp.auth();

const fetchEntryStates = ({ commit }) =>
	new Promise(resolve => {
		db.ref('/dict/entryStates')
			.once('value')
			.then(snap => {
				commit('ENTRY_STATES', snap.val());
				resolve();
			});
	});

export { fetchEntryStates };
