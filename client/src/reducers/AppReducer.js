export const appReducer = (state, action) => {
	const { allApps } = state;
	let { apps } = state;

	switch (action.type) {
		case "SET_APPS":
			apps = action.apps.map(app => ({ ...app, ...allApps[app.platform], active: true }));

			return { ...state, apps };
		case "ADD_APP":
			const newApp = { ...action.app, ...allApps[action.app.platform], active: true };

			apps.push(newApp);

			return { ...state, apps };
		case "DELETE_APP":
			apps = apps.filter(a => a._id !== action.app._id);

			return { ...state, apps };
		default:
			return state;
	}
};
