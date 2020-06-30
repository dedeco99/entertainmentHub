import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";

import WidgetDetail from "../widgets/WidgetDetail";
import Widgets from "../widgets/Widgets";
import WidgetEditMode from "../widgets/WidgetEditMode";

import { UserContext } from "../../contexts/UserContext";
import WidgetContextProvider from "../../contexts/WidgetContext";

class Index extends Component {
	constructor() {
		super();

		this.state = {
			openWidgetDetail: false,
		};

		this.handleWidgetDetailOpen = this.handleWidgetDetailOpen.bind(this);
		this.handleWidgetDetailClose = this.handleWidgetDetailClose.bind(this);
	}

	handleWidgetDetailOpen() {
		this.setState({ openWidgetDetail: true });
	}

	handleWidgetDetailClose() {
		this.setState({ openWidgetDetail: false });
	}

	renderDashboard() {
		const { openWidgetDetail } = this.state;

		return (
			<div>
				<WidgetContextProvider>
					<div>
						<WidgetDetail
							open={openWidgetDetail}
							onClose={this.handleWidgetDetailClose}
						/>
						<IconButton onClick={this.handleWidgetDetailOpen}>
							<i className="icofont-ui-add" />
						</IconButton>
						<WidgetEditMode />
						<Widgets />
					</div>
				</WidgetContextProvider>
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
		const { user } = this.context;

		if (user && user.token) return this.renderDashboard();

		return this.renderIndex();
	}
}

Index.contextType = UserContext;

export default Index;
