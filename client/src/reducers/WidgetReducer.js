export const widgetReducer = (state, action) => {
	let widgets = state.widgets;

	switch (action.type) {
		case "SET_WIDGETS":
			return { ...state, widgets: action.widgets };
		case "ADD_WIDGET":
			widgets.push(action.widget);

			return { ...state, widgets };
		case "EDIT_WIDGET":
			widgets = [...widgets.filter(w => w._id !== action.widget._id), action.widget];

			return { ...state, widgets };
		case "DELETE_WIDGET":
			widgets = widgets.filter(n => n._id !== action.widget._id);

			return { ...state, widgets };
		case "SET_EDIT_MODE":
			return { ...state, editMode: action.editMode };
		default:
			return state;
	}
};
