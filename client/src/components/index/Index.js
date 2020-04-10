import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

import Notifications from "./Notifications";
import Posts from "../reddit/Posts";
import Weather from "./Weather";

class Index extends Component {
	renderDashboard() {
		return (
			<div className="Index" >
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
						<Notifications />
					</Grid>
					<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
						<Posts />
						<br /><br />
						<Weather />
					</Grid>
				</Grid>
			</div>
		);
	}

	renderIndex() {
		return (
			<div>
				{"Login to see the good stuff"}
			</div>
		);
	}

	render() {
		const user = localStorage.getItem("user");
		const token = localStorage.getItem("token");

		if (user && token) return this.renderDashboard();

		return this.renderIndex();
	}
}

export default Index;
