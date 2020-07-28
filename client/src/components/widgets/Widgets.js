import React, { Component } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import Widget from "../widgets/Widget";
import Notifications from "../widgets/Notifications";
import Reddit from "../widgets/Reddit";
import Twitch from "../widgets/Twitch";
import Weather from "../widgets/Weather";
import TV from "../widgets/TV";
import Crypto from "../widgets/Crypto";

import { WidgetContext } from "../../contexts/WidgetContext";

import { getWidgets, editWidget } from "../../api/widgets";

const ResponsiveGridLayout = WidthProvider(Responsive);

const widgetsInfo = {
	notifications: widget => ({
		content: <Notifications height="100%" />,
		editText: "Notifications",
		editIcon: "icofont-alarm",
		dimensions: { w: widget.width || 1, h: widget.height || 4 },
		restrictions: { minW: 1, minH: 4, maxW: 2, maxH: 8 },
	}),
	reddit: widget => ({
		content: (
			<Reddit
				subreddit={widget.info.subreddit}
				search={widget.info.search}
				listView={widget.info.listView}
			/>
		),
		borderColor: "#ff4500",
		editText: `r/${widget.info.subreddit}`,
		editIcon: "icofont-reddit",
		dimensions: { w: widget.width || 1, h: widget.height || 2 },
		restrictions: { minW: 1, minH: 2, maxW: 3, maxH: 6 },
	}),
	twitch: widget => ({
		content: <Twitch />,
		borderColor: "#6441a5",
		editText: "Twitch",
		editIcon: "icofont-twitch",
		dimensions: { w: widget.width || 1, h: widget.height || 2 },
		restrictions: { minW: 1, minH: 2, maxW: 3, maxH: 6 },
	}),
	weather: widget => ({
		content: (
			<Weather
				city={widget.info.city}
				country={widget.info.country}
				lat={widget.info.lat}
				lon={widget.info.lon}
			/>
		),
		editText: "Weather",
		editIcon: "icofont-cloud",
		dimensions: { w: widget.width || 1, h: widget.height || 2 },
		restrictions: { minW: 1, minH: 2, maxW: 3, maxH: 6 },
	}),
	tv: widget => ({
		content: <TV />,
		editText: "TV",
		editIcon: "icofont-contrast",
		dimensions: { w: widget.width || 1, h: widget.height || 4 },
		restrictions: { minW: 1, minH: 4, maxW: 1, maxH: 8 },
	}),
	crypto: widget => ({
		content: <Crypto coins={widget.info.coins} />,
		editText: "Crypto",
		editIcon: "icofont-bitcoin",
		dimensions: { w: widget.width || 1, h: widget.height || 1 },
		restrictions: { minW: 1, minH: 1, maxW: 3, maxH: 6 },
	}),
};

class Widgets extends Component {
	constructor() {
		super();
		this.state = {
			rowHeight: 150,
			layouts: {},
		};

		this.handleEditWidget = this.handleEditWidget.bind(this);
		this.handleWidthChange = this.handleWidthChange.bind(this);
		this.handleLayoutChange = this.handleLayoutChange.bind(this);
	}

	async componentDidMount() {
		await this.getWidgets();
	}

	async getWidgets() {
		const { dispatch } = this.context;

		const response = await getWidgets();

		dispatch({ type: "SET_WIDGETS", widgets: response.data });
	}

	async handleEditWidget(updatedWidgets) {
		const { widgetState, dispatch } = this.context;
		const { widgets } = widgetState;

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
					dispatch({ type: "EDIT_WIDGET", widget: response.data });
				}
			}
		}
	}

	handleWidthChange(containerWidth, margin, cols, containerPadding) {
		this.setState({
			rowHeight: (containerWidth - (margin[0] * (cols - 1)) - (containerPadding[0] * 2)) / cols,
		});
	}

	handleLayoutChange(layout, layouts) {
		// TODO Probably save layouts
		this.setState({ layouts });
	}

	renderWidgets() {
		const { widgetState } = this.context;
		const { widgets, editMode } = widgetState;

		if (widgets && widgets.length) {
			return widgets.sort((a, b) => a.y - b.y).map(widget => {
				const widgetInfo = widgetsInfo[widget.type](widget);

				return (
					<div
						key={widget._id}
						data-grid={{
							x: widget.x,
							y: widget.y,
							...widgetInfo.dimensions,
							...widgetInfo.restrictions,
						}}
					>
						<Widget
							id={widget._id}
							type={widget.type}
							content={widgetInfo.content}
							borderColor={widgetInfo.borderColor}
							editText={widgetInfo.editText}
							editIcon={widgetInfo.editIcon}
							editMode={editMode}
							widgetDimensions={widgetInfo.dimensions}
						/>
					</div>
				);
			});
		}

		return null;
	}

	render() {
		const { rowHeight, layouts } = this.state;
		const { widgetState } = this.context;
		const { editMode } = widgetState;

		return (
			<div>
				<ResponsiveGridLayout
					className="layout"
					cols={{ xl: 8, lg: 8, md: 4, sm: 3, xs: 2, xxs: 1 }}
					isDraggable={editMode}
					isResizable={editMode}
					onDragStop={this.handleEditWidget}
					onResizeStop={this.handleEditWidget}
					onWidthChange={this.handleWidthChange}
					rowHeight={rowHeight}
					layouts={layouts}
					onLayoutChange={this.handleLayoutChange}
				>
					{this.renderWidgets()}
				</ResponsiveGridLayout>
			</div>
		);
	}
}

Widgets.contextType = WidgetContext;

export default Widgets;
