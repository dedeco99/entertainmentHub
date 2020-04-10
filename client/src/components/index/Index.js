import React, { Component } from "react";
import { toast } from "react-toastify";
import { Responsive, WidthProvider } from "react-grid-layout";
import IconButton from "@material-ui/core/IconButton";

import WidgetDetail from "./WidgetDetail";
import Notifications from "./Notifications";
import Posts from "../reddit/Posts";

import Widget from "./Widget";

import { getWidgets, addWidget, editWidget, deleteWidget } from "../../actions/widgets";

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
		this.handleToggleEdit = this.handleToggleEdit.bind(this);
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

	async handleEditWidget(widget) {
		const response = await editWidget(widget);

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

	handleToggleEdit() {
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
							<div key={widget._id} data-grid={{ x: 0, y: 0, w: 1, h: 4 }}>
								<Widget
									id={widget._id}
									content={<Notifications height="100%" />}
									editMode={editMode}
									editText={"Notifications"}
									editIcon={"icofont-alarm"}
									onDelete={this.handleDeleteWidget}
								/>
							</div>
						);
					case "reddit":
						return (
							<div key={widget._id} data-grid={{ x: 0, y: 0, w: 1, h: 2 }}>
								<Widget
									id={widget._id}
									content={<Posts subreddit={widget.info.subreddit} />}
									editMode={editMode}
									editText={`r/${widget.info.subreddit}`}
									editIcon={"icofont-reddit"}
									onDelete={this.handleDeleteWidget}
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
					onAdd={this.handleAddWidget}
				/>
				<IconButton onClick={this.handleWidgetDetailOpen}>
					<i className="icofont-ui-add" />
				</IconButton>
				<IconButton onClick={this.handleToggleEdit}>
					<i className="icofont-ui-edit" />
				</IconButton>
				{widgets ? (
					<ResponsiveGridLayout
						className="layout"
						breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
						cols={{ xl: 12, lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
						compactType={"horizontal"}
						preventCollision
						isDraggable={editMode}
						isResizable={editMode}
						containerPadding={[10, 0]}
					>
						{widgets}
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
