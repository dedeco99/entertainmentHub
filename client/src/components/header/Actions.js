import React, { useContext } from "react";

import { SpeedDial, SpeedDialAction } from "@material-ui/lab";

import { ActionContext } from "../../contexts/ActionContext";

function Actions() {
	const {
		state: { actions },
	} = useContext(ActionContext);

	return (
		<SpeedDial ariaLabel="Options" open hidden style={{ position: "relative", bottom: "-20px" }}>
			{actions.map(action => (
				<SpeedDialAction
					key={action.name}
					icon={action.icon}
					tooltipTitle={action.name}
					onClick={action.handleClick}
				/>
			))}
		</SpeedDial>
	);
}

export default Actions;
