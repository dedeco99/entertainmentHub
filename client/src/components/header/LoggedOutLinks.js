import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@material-ui/core";

function LoggedOutLinks() {
	return (
		<div>
			<Link to="/register" style={{ marginRight: 20 }}>
				<Button color="primary" variant="outlined">
					{"Register"}
				</Button>
			</Link>
			<Link to="/login">
				<Button color="primary" variant="outlined">
					{"Login"}
				</Button>
			</Link>
		</div>
	);
}

export default LoggedOutLinks;
