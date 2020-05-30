import React, { Component } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import IconButton from "@material-ui/core/IconButton";

import NotificationContextProvider from "../../contexts/NotificationContext";

import Widget from "../widgets/Widget";
import WidgetDetail from "../widgets/WidgetDetail";
import Notifications from "../widgets/Notifications";
import Reddit from "../widgets/Reddit";
import Twitch from "../widgets/Twitch";
import Weather from "../widgets/Weather";
import TV from "../widgets/TV";
import Crypto from "../widgets/Crypto";

import { getWidgets, addWidget, editWidget, deleteWidget } from "../../api/widgets";

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
		this.handleEditWidget = this.handleEditWidget.bind(this);
		this.handleDeleteWidget = this.handleDeleteWidget.bind(this);

		this.handleWidgetDetailOpen = this.handleWidgetDetailOpen.bind(this);
		this.handleWidgetDetailClose = this.handleWidgetDetailClose.bind(this);
		this.handleToggleEdit = this.handleToggleEdit.bind(this);
	}

	async componentDidMount() {
		const user = localStorage.getItem("user");
		const token = localStorage.getItem("token");

		if (user && token) await this.getWidgets();
	}

	async getWidgets() {
		const response = await getWidgets();

		this.setState({ widgets: response.data });
	}

	async handleAddWidget(widget) {
		const response = await addWidget(widget);

		if (response.status < 400) {
			this.setState(prevState => ({ widgets: [...prevState.widgets, response.data] }));
		}
	}

	async handleEditWidget(updatedWidgets) {
		const { widgets } = this.state;

		for (const updatedWidget of updatedWidgets) {
			const widgetToUpdate = widgets.find(w => w._id === updatedWidget.i);

			if (
				widgetToUpdate.x !== updatedWidget.x ||
				widgetToUpdate.y !== updatedWidget.y ||
				widgetToUpdate.width !== updatedWidget.w ||
				widgetToUpdate.height !== updatedWidget.h
			) {
				widgetToUpdate.x = updatedWidget.x;
				widgetToUpdate.y = updatedWidget.y;
				widgetToUpdate.width = updatedWidget.w;
				widgetToUpdate.height = updatedWidget.h;

				const response = await editWidget(widgetToUpdate);

				if (response.status < 400) {
					this.setState(prevState => ({
						widgets: [...prevState.widgets.filter(w => w._id !== response.data._id), response.data],
					}));
				}
			}
		}
	}

	async handleDeleteWidget(id) {
		const { widgets } = this.state;

		const response = await deleteWidget(id);

		if (response.status < 400) {
			const updatedWidgets = widgets.filter(w => w._id !== response.data._id);

			this.setState({ widgets: updatedWidgets });
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
			// eslint-disable-next-line complexity
			return widgets.map(widget => {
				let content = null;
				let editText = null;
				let editIcon = null;
				let dimensions = null;
				let restrictions = null;

				switch (widget.type) {
					case "notifications":
						content = (
							<NotificationContextProvider>
								<Notifications height="100%" />
							</NotificationContextProvider>
						);
						editText = "Notifications";
						editIcon = "icofont-alarm";
						dimensions = { w: widget.width || 1, h: widget.height || 4 };
						restrictions = { minW: 1, minH: 4, maxW: 2, maxH: 8 };
						break;
					case "reddit":
						content = (
							<Reddit
								subreddit={widget.info.subreddit}
								search={widget.info.search}
								listView={widget.info.listView}
							/>
						);
						editText = `r/${widget.info.subreddit}`;
						editIcon = "icofont-reddit";
						dimensions = { w: widget.width || 1, h: widget.height || 2 };
						restrictions = { minW: 1, minH: 2, maxW: 3, maxH: 6 };
						break;
					case "twitch":
						content = <Twitch />;
						editText = "Twitch";
						editIcon = "icofont-twitch";
						dimensions = { w: widget.width || 1, h: widget.height || 2 };
						restrictions = { minW: 1, minH: 2, maxW: 3, maxH: 6 };
						break;
					case "weather":
						content = (
							<Weather
								city={widget.info.city}
								country={widget.info.country}
								lat={widget.info.lat}
								lon={widget.info.lon}
							/>
						);
						editText = "Weather";
						editIcon = "icofont-cloud";
						dimensions = { w: widget.width || 1, h: widget.height || 2 };
						restrictions = { minW: 1, minH: 2, maxW: 3, maxH: 6 };
						break;
					case "tv":
						content = <TV />;
						editText = "TV";
						editIcon = "icofont-contrast";
						dimensions = { w: widget.width || 1, h: widget.height || 4 };
						restrictions = { minW: 1, minH: 4, maxW: 1, maxH: 8 };
						break;
					case "crypto":
						content = <Crypto coins={widget.info.coins} />;
						editText = "Crypto";
						editIcon = "icofont-bitcoin";
						dimensions = { w: widget.width || 1, h: widget.height || 2 };
						restrictions = { minW: 1, minH: 2, maxW: 3, maxH: 6 };
						break;
					default: return <div />;
				}

				return (
					<div
						key={widget._id}
						data-grid={{
							x: widget.x,
							y: widget.y,
							...dimensions,
							...restrictions,
						}}
					>
						<Widget
							id={widget._id}
							content={content}
							editMode={editMode}
							editText={editText}
							editIcon={editIcon}
							onDelete={this.handleDeleteWidget}
						/>
					</div>
				);
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
						containerPadding={[10, 0]}
						isDraggable={editMode}
						isResizable={editMode}
						onDragStop={this.handleEditWidget}
						onResizeStop={this.handleEditWidget}
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
