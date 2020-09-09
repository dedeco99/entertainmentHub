import React, { useContext, useState, useEffect } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

import { makeStyles, Box, Tabs, Tab } from "@material-ui/core";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";

import Loading from "../.partials/Loading";
import Widget from "../widgets/Widget";
import Notifications from "../widgets/Notifications";
import Reddit from "../widgets/reddit/Reddit";
import Twitch from "../widgets/Twitch";
import Weather from "../widgets/Weather";
import TV from "../widgets/TV";
import Crypto from "../widgets/Crypto";
import Price from "../widgets/Price";
import WidgetDetail from "../widgets/WidgetDetail";

import { WidgetContext } from "../../contexts/WidgetContext";

import { getWidgets, editWidget, deleteWidget } from "../../api/widgets";

import generalStyles from "../../styles/General";
import { widgets as widgetStyles } from "../../styles/Widgets";

const useStyles = makeStyles({ ...generalStyles, ...widgetStyles });

const ResponsiveGridLayout = WidthProvider(Responsive);

const widgetRestrictions = {
	notifications: { minW: 2, minH: 2, maxW: 6, maxH: 6 },
	reddit: { minW: 2, minH: 2, maxW: 4, maxH: 6 },
	twitch: { minW: 2, minH: 2, maxW: 4, maxH: 6 },
	weather: { minW: 2, minH: 1, maxW: 4, maxH: 2 },
	tv: { minW: 2, minH: 2, maxW: 6, maxH: 6 },
	crypto: { minW: 1, minH: 1, maxW: 4, maxH: 4 },
	price: { minW: 1, minH: 1, maxW: 4, maxH: 4 },
};

const widgetsInfo = {
	notifications: widget => ({
		content: <Notifications height="100%" />,
		editText: "Notifications",
		editIcon: "icon-notifications",
		dimensions: { w: widget.width || 1, h: widget.height || 4 },
		restrictions: widgetRestrictions.notifications,
	}),
	reddit: widget => ({
		content: (
			<Reddit subreddit={widget.info.subreddit} search={widget.info.search} listView={widget.info.listView} />
		),
		borderColor: "#ff4500",
		editText: `r/${widget.info.subreddit}`,
		editIcon: "icon-reddit-filled",
		dimensions: { w: widget.width || 1, h: widget.height || 2 },
		restrictions: widgetRestrictions.reddit,
	}),
	twitch: widget => ({
		content: <Twitch />,
		borderColor: "#6441a5",
		editText: "Twitch",
		editIcon: "icon-twitch-filled",
		dimensions: { w: widget.width || 1, h: widget.height || 2 },
		restrictions: widgetRestrictions.twitch,
	}),
	weather: widget => ({
		content: (
			<Weather city={widget.info.city} country={widget.info.country} lat={widget.info.lat} lon={widget.info.lon} />
		),
		editText: "Weather",
		editIcon: "icon-cloud",
		dimensions: { w: widget.width || 1, h: widget.height || 2 },
		restrictions: widgetRestrictions.weather,
	}),
	tv: widget => ({
		content: <TV />,
		editText: "TV",
		editIcon: "icon-monitor-filled",
		dimensions: { w: widget.width || 1, h: widget.height || 4 },
		restrictions: widgetRestrictions.tv,
	}),
	crypto: widget => ({
		content: <Crypto coins={widget.info.coins} />,
		editText: "Crypto",
		editIcon: "icon-crypto",
		dimensions: { w: widget.width || 1, h: widget.height || 1 },
		restrictions: widgetRestrictions.crypto,
	}),
	price: widget => ({
		content: <Price country={widget.info.country} productId={widget.info.productId} />,
		editText: "Price",
		editIcon: "icon-money",
		dimensions: { w: widget.width || 1, h: widget.height || 1 },
		restrictions: widgetRestrictions.price,
	}),
};

function Widgets() {
	const classes = useStyles();
	const { state, dispatch } = useContext(WidgetContext);
	const { widgets, editMode } = state;
	const [loading, setLoading] = useState(false);
	const [openWidgetDetail, setOpenWidgetDetail] = useState(false);
	const [openOptions, setOpenOptions] = useState(false);
	const [rowHeight, setRowHeight] = useState(150);
	const [layouts, setLayouts] = useState({});
	const [selectedWidget, setSelectedWidget] = useState(null);
	const [tabs, setTabs] = useState([]);
	const [selectedTab, setSelectedTab] = useState(0);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			setLoading(true);

			const response = await getWidgets();

			if (response.status === 200 && isMounted) {
				dispatch({ type: "SET_WIDGETS", widgets: response.data });

				setLoading(false);
			}
		}

		fetchData();

		return () => (isMounted = false);
	}, []); // eslint-disable-line

	useEffect(() => {
		const uniqueTabs = [];

		for (const widget of widgets) {
			widget.group = widget.group ? widget.group : { name: "Ungrouped" };

			if (!uniqueTabs.find(tab => tab.name === widget.group.name)) uniqueTabs.push(widget.group);
		}

		if (uniqueTabs.length < tabs.length) setSelectedTab(0);

		setTabs(uniqueTabs);
	}, [widgets]); // eslint-disable-line

	function handleOpenOptions() {
		setOpenOptions(true);
	}

	function handleCloseOptions() {
		setOpenOptions(false);
	}

	function handleWidgetDetailOpen(e, widget) {
		if (widget) setSelectedWidget(widget);
		setOpenWidgetDetail(true);
	}

	function handleWidgetDetailClose() {
		setSelectedWidget(null);
		setOpenWidgetDetail(false);
	}

	function handleEditMode() {
		dispatch({ type: "SET_EDIT_MODE", editMode: !editMode });
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

				if (response.status === 200) {
					dispatch({ type: "EDIT_WIDGET", widget: response.data });
				}
			}
		}
	}

	function handleWidthChange(containerWidth, margin, cols) {
		// prettier-ignore
		setRowHeight((containerWidth - (margin[0] * (cols - 1))) / cols);
	}

	function handleLayoutChange(layout, layouts) {
		// TODO Probably save layouts
		setLayouts(layouts);
	}

	function handleChangeTab(e, tab) {
		setSelectedTab(tab);
	}

	async function handleDeleteWidget(id) {
		const response = await deleteWidget(id);

		if (response.status === 200) {
			dispatch({ type: "DELETE_WIDGET", widget: response.data });
		}
	}

	function renderWidgets() {
		return widgets
			.filter(widget => widget.group.name === tabs[selectedTab].name)
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
							onEdit={e => handleWidgetDetailOpen(e, widget)}
							onDelete={handleDeleteWidget}
						/>
					</div>
				);
			});
	}

	if (loading || !tabs.length) {
		return (
			<Box className={classes.root}>
				<Loading />
			</Box>
		);
	}

	const actions = [
		{ name: "Add Widget", icon: <i className="icon-add" />, handleClick: handleWidgetDetailOpen },
		{ name: "Move & Resize", icon: <i className="icon-expand" />, handleClick: handleEditMode },
	];

	return (
		<>
			{tabs.length > 1 && (
				<Tabs value={selectedTab} onChange={handleChangeTab}>
					{tabs.map(tab => (
						<Tab key={tab.name} label={tab.name} />
					))}
				</Tabs>
			)}
			{widgets && widgets.length ? (
				<ResponsiveGridLayout
					className="layout"
					breakpoints={{ xxl: 2000, xl: 1700, lg: 1200, md: 950, sm: 750, xs: 450, xxs: 0 }}
					cols={{ xxl: 12, xl: 10, lg: 8, md: 6, sm: 5, xs: 3, xxs: 2 }}
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
			<WidgetDetail
				open={openWidgetDetail}
				widget={selectedWidget}
				widgetGroups={tabs}
				widgetRestrictions={widgetRestrictions}
				onClose={handleWidgetDetailClose}
			/>
			<SpeedDial
				ariaLabel="Options"
				icon={<i className="icon-add" />}
				onClose={handleCloseOptions}
				onOpen={handleOpenOptions}
				open={openOptions}
				className={classes.speedDial}
				FabProps={{ size: "small" }}
			>
				{actions.map(action => (
					<SpeedDialAction
						key={action.name}
						icon={action.icon}
						tooltipTitle={action.name}
						onClick={action.handleClick}
					/>
				))}
			</SpeedDial>
		</>
	);
}

export default Widgets;
