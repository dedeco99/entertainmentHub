import React, { useContext, useState, useEffect } from "react";
import GridLayout, { Responsive, WidthProvider } from "react-grid-layout";

import { makeStyles, Box, Tabs, Tab } from "@material-ui/core";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";

import Loading from "../.partials/Loading";
import Widget from "../widgets/Widget";
import Notifications from "../widgets/Notifications";
import Reddit from "../widgets/reddit/Reddit";
import Twitch from "../widgets/Twitch";
import Weather from "../widgets/Weather";
import TV from "../widgets/TV";
import Finance from "../widgets/Finance";
import Price from "../widgets/Price";
import Emails from "../widgets/Emails";
import WidgetDetail from "../widgets/WidgetDetail";
import CurrencyConverter from "../widgets/CurrencyConverter";

import { WidgetContext } from "../../contexts/WidgetContext";

import { getWidgets, editWidgets, deleteWidget } from "../../api/widgets";

import generalStyles from "../../styles/General";
import { widgets as widgetStyles } from "../../styles/Widgets";
import { translate } from "../../utils/translations";

const useStyles = makeStyles({ ...generalStyles, ...widgetStyles });

const ResponsiveGridLayout = WidthProvider(Responsive);

const widgetRestrictions = {
	notifications: { minW: 2, minH: 2, maxW: 6, maxH: 6 },
	reddit: { minW: 2, minH: 2, maxW: 4, maxH: 6 },
	twitch: { minW: 2, minH: 2, maxW: 4, maxH: 6 },
	weather: { minW: 1, minH: 1, maxW: 4, maxH: 2 },
	tv: { minW: 2, minH: 2, maxW: 6, maxH: 6 },
	finance: { minW: 1, minH: 1, maxW: 4, maxH: 4 },
	price: { minW: 1, minH: 1, maxW: 4, maxH: 4 },
	currencyConverter: { minW: 2, minH: 1, maxW: 2, maxH: 1 },
	email: { minW: 2, minH: 2, maxW: 6, maxH: 6 },
};

const widgetsInfo = {
	notifications: widget => ({
		content: <Notifications height="100%" wrapTitle={widget.info ? widget.info.wrapTitle : false} />,
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
		content: <TV tabs={widget.info.tabs} listView={widget.info.listView} />,
		editText: "TV",
		editIcon: "icon-monitor-filled",
		dimensions: { w: widget.width || 1, h: widget.height || 4 },
		restrictions: widgetRestrictions.tv,
	}),
	finance: widget => ({
		content: <Finance coins={widget.info.coins} stocks={widget.info.stocks} />,
		editText: "Finance",
		editIcon: "icon-finance",
		dimensions: { w: widget.width || 1, h: widget.height || 1 },
		restrictions: widgetRestrictions.finance,
	}),
	price: widget => ({
		content: <Price country={widget.info.country} productId={widget.info.productId} />,
		editText: "Price",
		editIcon: "icon-money",
		dimensions: { w: widget.width || 1, h: widget.height || 1 },
		restrictions: widgetRestrictions.price,
	}),
	currencyConverter: widget => ({
		content: <CurrencyConverter />,
		editText: "Currency Converter",
		editIcon: "icon-converter",
		dimensions: { w: widget.width || 2, h: widget.height || 2 },
		restrictions: widgetRestrictions.currency,
	}),
	email: widget => ({
		content: <Emails />,
		editText: "Emails",
		editIcon: "icon-email",
		dimensions: { w: widget.width || 2, h: widget.height || 2 },
		restrictions: widgetRestrictions.email,
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
	const [tabs, setTabs] = useState([{ name: "Ungrouped" }]);
	const [selectedTab, setSelectedTab] = useState(0);
	const [tabsEditMode, setTabsEditMode] = useState(false);

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
	}, []);

	useEffect(() => {
		const uniqueTabs = [];

		for (const widget of widgets) {
			widget.group = widget.group ? widget.group : { name: "Ungrouped" };

			if (!uniqueTabs.find(tab => tab.name === widget.group.name)) uniqueTabs.push(widget.group);
		}

		if (uniqueTabs.length < tabs.length) setSelectedTab(0);

		setTabs(uniqueTabs);
	}, [widgets]);

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

	function handleTabEditMode() {
		setTabsEditMode(prev => !prev);
	}

	async function handleEditWidget(updatedWidgets) {
		const widgetsToUpdate = [];
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

				widgetsToUpdate.push(widgetToUpdate);
			}
		}

		if (widgetsToUpdate.length) {
			const response = await editWidgets(widgetsToUpdate);

			if (response.status === 200) {
				for (const widget of response.data) {
					dispatch({ type: "EDIT_WIDGET", widget });
				}
			}
		}
	}

	async function handleEditTab(updatedTabs) {
		const widgetsToUpdate = [];
		for (const updatedTab of updatedTabs) {
			const widgetsToMaybeUpdate = widgets.filter(w => w.group.name === updatedTab.i);

			if (widgetsToMaybeUpdate[0].group.pos !== updatedTab.x) {
				for (const widgetToUpdate of widgetsToMaybeUpdate) {
					widgetToUpdate.group = { ...widgetToUpdate.group, pos: updatedTab.x };

					widgetsToUpdate.push(widgetToUpdate);
				}
			}
		}

		if (widgetsToUpdate.length) {
			const response = await editWidgets(widgetsToUpdate);

			if (response.status === 200) {
				for (const widget of response.data) {
					dispatch({ type: "EDIT_WIDGET", widget });
				}
			}
		}
	}

	function handleWidthChange(containerWidth, margin, cols) {
		setRowHeight((containerWidth - margin[0] * (cols - 1)) / cols);
	}

	function handleLayoutChange(layout, newLayouts) {
		// TODO Probably save layouts
		setLayouts(newLayouts);
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

	function renderTabs() {
		if (tabs.length <= 1) return null;

		if (tabsEditMode) {
			return (
				<div
					value={selectedTab}
					onChange={handleChangeTab}
					style={{
						backgroundColor: "#222",
						marginRight: document.body.scrollHeight > document.body.clientHeight ? -10 : 0,
						borderRadius: 3,
						overflowX: "scroll",
						width: "100%",
					}}
				>
					<GridLayout
						className="layout"
						rowHeight={48}
						cols={tabs.length}
						width={160 * tabs.length}
						margin={[0, 0]}
						compactType="horizontal"
						isResizable={false}
						maxRows={1}
						onDragStop={handleEditTab}
					>
						{tabs
							.sort((a, b) => a.pos - b.pos)
							.map((tab, i) => (
								<div key={tab.name} data-grid={{ x: i, y: 0, w: 1, h: 1 }}>
									<Tab label={tab.name} />
									<Box
										position="absolute"
										bottom="0"
										left="0"
										width="100%"
										display="flex"
										alignItems="center"
										justifyContent="center"
									>
										<i className="icon-drag-handle" />
									</Box>
								</div>
							))}
					</GridLayout>
				</div>
			);
		}

		return (
			<Tabs
				value={selectedTab}
				onChange={handleChangeTab}
				variant="scrollable"
				style={{
					backgroundColor: "#222",
					marginRight: document.body.scrollHeight > document.body.clientHeight ? -10 : 0,
					borderRadius: 3,
				}}
			>
				{tabs
					.sort((a, b) => a.pos - b.pos)
					.map(tab => (
						<Tab key={tab.name} label={tab.name} />
					))}
			</Tabs>
		);
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
							refreshRateMinutes={widget.refreshRateMinutes}
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

	if (loading) {
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

	if (tabs.length > 1) {
		actions.push({ name: "Edit tabs", icon: <i className="icon-tabs" />, handleClick: handleTabEditMode });
	}

	return (
		<>
			{renderTabs()}
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
					containerPadding={[0, 10]}
					style={{
						top: tabs.length <= 1 ? "-10px" : "0px",
						marginRight: document.body.scrollHeight > document.body.clientHeight ? 15 : 0,
					}}
				>
					{renderWidgets()}
				</ResponsiveGridLayout>
			) : (
				<Box className={classes.root}>{translate("noWidgets")}</Box>
			)}
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
