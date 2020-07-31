import React, { useContext, useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";

import Loading from "../.partials/Loading";

import Widget from "../widgets/Widget";
import Notifications from "../widgets/Notifications";
import Reddit from "../widgets/reddit/Reddit";
import Twitch from "../widgets/Twitch";
import Weather from "../widgets/Weather";
import TV from "../widgets/TV";
import Crypto from "../widgets/Crypto";
import WidgetDetail from "../widgets/WidgetDetail";

import { WidgetContext } from "../../contexts/WidgetContext";

import { getWidgets, editWidget, deleteWidget } from "../../api/widgets";

import { widgets as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

const ResponsiveGridLayout = WidthProvider(Responsive);

const widgetsInfo = {
	notifications: widget => ({
		content: <Notifications height="100%" />,
		editText: "Notifications",
		editIcon: "icofont-alarm",
		dimensions: { w: widget.width || 1, h: widget.height || 4 },
		restrictions: { minW: 2, minH: 2, maxW: 6, maxH: 6 },
	}),
	reddit: widget => ({
		content: (
			<Reddit subreddit={widget.info.subreddit} search={widget.info.search} listView={widget.info.listView} />
		),
		borderColor: "#ff4500",
		editText: `r/${widget.info.subreddit}`,
		editIcon: "icofont-reddit",
		dimensions: { w: widget.width || 1, h: widget.height || 2 },
		restrictions: { minW: 2, minH: 2, maxW: 4, maxH: 6 },
	}),
	twitch: widget => ({
		content: <Twitch />,
		borderColor: "#6441a5",
		editText: "Twitch",
		editIcon: "icofont-twitch",
		dimensions: { w: widget.width || 1, h: widget.height || 2 },
		restrictions: { minW: 2, minH: 2, maxW: 4, maxH: 6 },
	}),
	weather: widget => ({
		content: (
			<Weather city={widget.info.city} country={widget.info.country} lat={widget.info.lat} lon={widget.info.lon} />
		),
		editText: "Weather",
		editIcon: "icofont-cloud",
		dimensions: { w: widget.width || 1, h: widget.height || 2 },
		restrictions: { minW: 2, minH: 1, maxW: 4, maxH: 2 },
	}),
	tv: widget => ({
		content: <TV />,
		editText: "TV",
		editIcon: "icofont-contrast",
		dimensions: { w: widget.width || 1, h: widget.height || 4 },
		restrictions: { minW: 2, minH: 2, maxW: 6, maxH: 6 },
	}),
	crypto: widget => ({
		content: <Crypto coins={widget.info.coins} />,
		editText: "Crypto",
		editIcon: "icofont-bitcoin",
		dimensions: { w: widget.width || 1, h: widget.height || 1 },
		restrictions: { minW: 1, minH: 1, maxW: 4, maxH: 4 },
	}),
};

function Widgets() {
	const classes = useStyles();
	const { widgetState, dispatch } = useContext(WidgetContext);
	const { widgets, editMode } = widgetState;
	const [loading, setLoading] = useState(false);
	const [openWidgetDetail, setOpenWidgetDetail] = useState(false);
	const [rowHeight, setRowHeight] = useState(150);
	const [layouts, setLayouts] = useState({});

	useEffect(() => {
		async function fetchData() {
			setLoading(true);

			const response = await getWidgets();

			dispatch({ type: "SET_WIDGETS", widgets: response.data });

			setLoading(false);
		}

		fetchData();
	}, []); // eslint-disable-line

	function handleWidgetDetailOpen() {
		setOpenWidgetDetail(true);
	}

	function handleWidgetDetailClose() {
		setOpenWidgetDetail(false);
	}

	async function handleEditWidget(updatedWidgets) {
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

	function handleWidthChange(containerWidth, margin, cols, containerPadding) {
		// prettier-ignore
		setRowHeight((containerWidth - (margin[0] * (cols - 1)) - (containerPadding[0] * 2)) / cols);
	}

	function handleLayoutChange(layout, layouts) {
		// TODO Probably save layouts
		setLayouts(layouts);
	}

	async function handleDeleteWidget(id) {
		const response = await deleteWidget(id);

		if (response.status < 400) {
			dispatch({ type: "DELETE_WIDGET", widget: response.data });
		}
	}

	function renderWidgets() {
		return widgets
			.sort((a, b) => a.y - b.y)
			.map(widget => {
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
							widgetDimensions={widgetInfo.dimensions}
							onDelete={handleDeleteWidget}
						/>
					</div>
				);
			});
	}

	if (loading) {
		return (
			<Box className={classes.root}>
				<Loading />
			</Box>
		);
	}

	return (
		<>
			{widgets && widgets.length ? (
				<ResponsiveGridLayout
					className="layout"
					cols={{ xl: 8, lg: 8, md: 7, sm: 4, xs: 3, xxs: 2 }}
					isDraggable={editMode}
					isResizable={editMode}
					onDragStop={handleEditWidget}
					onResizeStop={handleEditWidget}
					onWidthChange={handleWidthChange}
					rowHeight={rowHeight}
					layouts={layouts}
					onLayoutChange={handleLayoutChange}
				>
					{renderWidgets()}
				</ResponsiveGridLayout>
			) : null}
			<WidgetDetail open={openWidgetDetail} onClose={handleWidgetDetailClose} />
			<Box className={classes.addWidget}>
				<Tooltip title="Add Widget">
					<Fab onClick={handleWidgetDetailOpen}>
						<span className="material-icons">{"add"}</span>
					</Fab>
				</Tooltip>
			</Box>
		</>
	);
}

export default Widgets;
