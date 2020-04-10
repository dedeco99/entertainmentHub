import React, { Component } from "react";
import { toast } from "react-toastify";
import IconButton from "@material-ui/core/IconButton";

import WidgetDetail from "./WidgetDetail";
import Notifications from "./Notifications";
import Posts from "../reddit/Posts";

import Widget from "./Widget";

import { Responsive, WidthProvider } from "react-grid-layout";

import { getWidgets, addWidget, deleteWidget } from "../../actions/widgets";

const ResponsiveGridLayout = WidthProvider(Responsive);

class Index extends Component {
	constructor() {
		super();

		this.state = {
			widgets: [],

			openWidgetDetail: false,
			editMode: false,
		};

		this.handleAddWidget = this.handleAddWidget.bind(this);
		this.handleDeleteWidget = this.handleDeleteWidget.bind(this);

		this.handleWidgetDetailOpen = this.handleWidgetDetailOpen.bind(this);
		this.handleWidgetDetailClose = this.handleWidgetDetailClose.bind(this);

		this.toggleEdit = this.toggleEdit.bind(this);
	}

	async componentDidMount() {
		const response = await getWidgets();

		this.setState({ widgets: response.data });
	}

	async handleAddWidget(widget) {
		const response = await addWidget(widget);

		if (response.status < 400) {
			this.setState(prevState => ({ widgets: [...prevState.widgets, response.data] }));

			toast.success(response.message);
		} else {
			toast.error(response.message);
		}
	}

	async handleDeleteWidget(id) {
		const { widgets } = this.state;

		const response = await deleteWidget(id);

		if (response.status < 400) {
			const updatedWidgets = widgets.filter(w => w._id !== response.data._id);

			this.setState({ widgets: updatedWidgets });

			toast.success(response.message);
		} else {
			toast.error(response.message);
		}
	}

	handleWidgetDetailOpen() {
		this.setState({ openWidgetDetail: true });
	}

	handleWidgetDetailClose() {
		this.setState({ openWidgetDetail: false });
	}

	toggleEdit() {
		const { editMode } = this.state;
		this.setState({ editMode: !editMode });
	}

	renderWidgets() {
		const { widgets, editMode } = this.state;

		if (widgets && widgets.length) {
			return widgets.map(widget => {
				switch (widget.type) {
					case "notifications":
						return (
							<div key={widget._id} data-grid={{ x: 0, y: 0, w: 3, h: 2 }}>
								<Widget
									editMode={editMode}
									editText={"Notifications"}
									editIcon={"icofont-alarm"}
									content={<Notifications height="100%" />}
								/>
							</div>
						);
					case "reddit":
						return (
							<div key={widget._id} data-grid={{ x: 0, y: 0, w: 2, h: 2 }}>
								<Widget
									editMode={editMode}
									editText={`r/${widget.info.subreddit}`}
									editIcon={"icofont-reddit"}
									content={<Posts subreddit={widget.info.subreddit} />}
								/>
							</div>
						);
					default: return null;
				}
			});
		}

		return null;
	}

	renderDashboard() {
		const { openWidgetDetail, editMode } = this.state;
		const widgets = this.renderWidgets();

		return (
			<div className="Index" >
				<WidgetDetail
					open={openWidgetDetail}
					onClose={this.handleWidgetDetailClose}
					onAddWidget={this.handleAddWidget}
				/>
				<IconButton onClick={this.handleWidgetDetailOpen}>
					<i className="icofont-ui-add" />
				</IconButton>
				<IconButton onClick={this.handleDeleteWidget}>
					<i className="icofont-ui-delete" />
				</IconButton>
				<IconButton onClick={this.toggleEdit}>
					<i className="icofont-ui-edit" />
				</IconButton>
				{ widgets ? (
					<ResponsiveGridLayout
						className="layout"
						breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
						cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
						verticalCompact={false}
						preventCollision={true}
						isDraggable={editMode}
						isResizable={editMode}
						containerPadding={[10, 10]}
						style={{ backgroundColor: "lightgrey" }}
					>
						{ widgets }
					</ResponsiveGridLayout>
				) : "No widgets"}
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
