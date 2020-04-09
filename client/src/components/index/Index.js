import React, { Component } from "react";
import { toast } from "react-toastify";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

import Notifications from "./Notifications";
import Posts from "../reddit/Posts";

import { getWidgets, addWidget, deleteWidget } from "../../actions/widgets";

class Index extends Component {
	constructor() {
		super();

		this.state = {
			widgets: [],
		};

		this.addWidget = this.addWidget.bind(this);
		this.deleteWidget = this.deleteWidget.bind(this);
	}

	async componentDidMount() {
		const response = await getWidgets();

		this.setState({ widgets: response.data });
	}

	async addWidget(widget) {
		const subreddits = ["MechanicalKeyboards", "dankmemes", "gif", "GlobalOffensive"];

		const response = await addWidget({
			type: "reddit",
			info: {
				subreddit: subreddits[Math.floor(Math.random() * subreddits.length)],
			},
		});

		if (response.status < 400) {
			this.setState(prevState => ({ widgets: [...prevState.widgets, response.data] }));

			toast.success(response.message);
		} else {
			toast.error(response.message);
		}
	}

	async deleteWidget(id) {
		const { widgets } = this.state;

		const response = await deleteWidget(widgets[widgets.length - 1]._id);

		if (response.status < 400) {
			const { widgets } = this.state;

			const updatedWidgets = widgets.filter(w => w._id !== response.data._id);

			this.setState({ widgets: updatedWidgets });

			toast.success(response.message);
		} else {
			toast.error(response.message);
		}
	}

	renderWidgets() {
		const { widgets } = this.state;

		if (widgets && widgets.length) {
			return widgets.map(widget => {
				switch (widget.type) {
					case "notifications":
						return (
							<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={widget._id}>
								<Notifications />
							</Grid>
						);
					case "reddit":
						return (
							<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={widget._id}>
								<Posts subreddit={widget.info.subreddit} />
							</Grid>
						);
					default: return null;
				}
			});
		}

		return (
			<Grid
				item xs={12}
				key={1}
			>
				<div style={{ textAlign: "center" }}>{"No widgets"}</div>
			</Grid>
		);
	}

	renderDashboard() {
		return (
			<div className="Index" >
				<IconButton onClick={this.addWidget}>
					<i className="icofont-ui-add" />
				</IconButton>
				<IconButton onClick={this.deleteWidget}>
					<i className="icofont-ui-delete" />
				</IconButton>
				<Grid container spacing={2}>
					{this.renderWidgets()}
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
