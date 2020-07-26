import React, { useContext, useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";

import Widget from "../widgets/Widget";
import Notifications from "../widgets/Notifications";
import Reddit from "../widgets/reddit/Reddit";
import Twitch from "../widgets/Twitch";
import Weather from "../widgets/Weather";
import TV from "../widgets/TV";
import Crypto from "../widgets/Crypto";
import WidgetDetail from "../widgets/WidgetDetail";

import { WidgetContext } from "../../contexts/WidgetContext";

import { getWidgets, editWidget } from "../../api/widgets";

import { widgets as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

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
			<Reddit subreddit={widget.info.subreddit} search={widget.info.search} listView={widget.info.listView} />
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
			<Weather city={widget.info.city} country={widget.info.country} lat={widget.info.lat} lon={widget.info.lon} />
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
		dimensions: { w: widget.width || 1, h: widget.height || 2 },
		restrictions: { minW: 1, minH: 2, maxW: 3, maxH: 6 },
	}),
};

function Widgets() {
	const classes = useStyles();
	const { widgetState, dispatch } = useContext(WidgetContext);
	const { widgets, editMode } = widgetState;
	const [loading, setLoading] = useState(false);
	const [openWidgetDetail, setOpenWidgetDetail] = useState(false);

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
						/>
					</div>
				);
			});
	}

	if (loading) {
		return (
			<Box className={classes.root}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<>
			{widgets && widgets.length ? (
				<ResponsiveGridLayout
					className="layout"
					breakpoints={{ xl: 1870, lg: 1230, md: 910, sm: 550, xs: 430, xxs: 0 }}
					cols={{ xl: 6, lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
					isDraggable={editMode}
					isResizable={editMode}
					onDragStop={handleEditWidget}
					onResizeStop={handleEditWidget}
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
