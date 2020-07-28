import React, { useContext } from "react";

import Widgets from "../widgets/Widgets";

import { UserContext } from "../../contexts/UserContext";

function Index() {
	const { user } = useContext(UserContext);

	if (user && user.token) return <Widgets />;

	return <div>{"Login to see the good stuff"}</div>;
}

export default Index;
