import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import Widgets from "../widgets/Widgets";

import { UserContext } from "../../contexts/UserContext";

function Index() {
	const history = useHistory();
	const { user } = useContext(UserContext);

	if (user && user.token) return <Widgets />;

	history.push("/login");

	return null;
}

export default Index;
