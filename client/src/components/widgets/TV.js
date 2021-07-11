import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles, Zoom, Tabs, Tab, List, ListItem, Paper, Typography, Box } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";

import Loading from "../.partials/Loading";
import CustomScrollbar from "../.partials/CustomScrollbar";
import Popular from "../tv/Popular";

import { getSeasons } from "../../api/tv";
import { formatDate } from "../../utils/utils";
import { translate } from "../../utils/translations";

import { tv as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function TV({ tabs, listView }) {
	const classes = useStyles({ hasTabs: tabs.length > 1 });
	const [tabIndex, setTabIndex] = useState(0);
	const [inQueueEpisodes, setInQueueEpisodes] = useState([]);
	const [allEpisodes, setAllEpisodes] = useState([]);
	const [popularFilter, setPopularFilter] = useState("tv");
	const [future, setFuture] = useState([]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			const response = await Promise.all([
				getSeasons("all", 0, "queue"),
				getSeasons("all", 0, "passed"),
				getSeasons("all", 0, "future"),
			]);

			if (isMounted) {
				setInQueueEpisodes(response[0].data);
				setAllEpisodes(response[1].data);
				setFuture(response[2].data);
				setOpen(true);
			}
		}

		fetchData();

		return () => (isMounted = false);
	}, []);

	function handleChange(event, newValue) {
		setTabIndex(newValue);
	}

	function handlePopularFilter(e, value) {
		if (value && value !== popularFilter) setPopularFilter(value);
	}

	function renderPopularList() {
		return (
			<>
				<Box display="flex" alignItems="center" justifyContent="center" pt={1}>
					<ToggleButtonGroup
						value={popularFilter}
						onChange={handlePopularFilter}
						color="primary"
						size="small"
						exclusive
					>
						<ToggleButton value="tv" color="primary" variant="outlined">
							{translate("tv")}
						</ToggleButton>
						<ToggleButton value="movies" color="primary" variant="outlined">
							{translate("movies")}
						</ToggleButton>
					</ToggleButtonGroup>
				</Box>
				<Popular type={popularFilter} bannerWidth={140} useWindowScroll={false} listView={listView} />
			</>
		);
	}

	function renderEpisodeList(episodes) {
		const episodeList = episodes.map(episode => {
			const seasonLabel = episode.season > 9 ? `S${episode.season}` : `S0${episode.season}`;
			const episodeLabel = episode.number > 9 ? `E${episode.number}` : `E0${episode.number}`;

			return (
				<ListItem className={classes.episodeList} alignItems="flex-start" key={episode._id} button divider>
					<Box display="flex" width="100%">
						<Typography className={classes.episodeName} variant="body1">
							{episode.series.displayName}
						</Typography>
						<Typography className={classes.episodeDate} variant="caption">
							{formatDate(episode.date, "DD-MM-YYYY")}
						</Typography>
					</Box>
					<Typography variant="body2">{`${seasonLabel + episodeLabel} - ${episode.title}`}</Typography>
				</ListItem>
			);
		});

		return (
			<CustomScrollbar>
				<List>{episodeList}</List>
			</CustomScrollbar>
		);
	}

	function a11yTabProps(index) {
		return {
			id: `tvwidget-tab-${index}`,
			"aria-controls": `tvwidget-tabpanel-${index}`,
		};
	}

	function a11yTabPanelProps(index) {
		return {
			id: `tvwidget-tabpanel-${index}`,
			"aria-labelledby": `tvwidget-tab-${index}`,
		};
	}

	if (!open) return <Loading />;

	const tabOptions = [
		{ key: "inQueue", name: translate("inQueueEpisodes"), content: () => renderEpisodeList(inQueueEpisodes) },
		{ key: "all", name: translate("all"), content: () => renderEpisodeList(allEpisodes) },
		{ key: "popular", name: "Popular", content: () => renderPopularList() },
		{ key: "future", name: translate("upcomingEpisodes"), content: () => renderEpisodeList(future) },
	];

	const tabsList = [];
	const tabsContent = [];
	for (let i = 0; i < tabs.length; i++) {
		const tabOption = tabOptions.find(t => t.key === tabs[i]);
		tabsList.push(<Tab key={i} label={tabOption.name} className={classes.tab} {...a11yTabProps(i)} />);
		tabsContent.push(
			<div key={i} role="tabpanel" hidden={tabIndex !== i} className={classes.tabPanel} {...a11yTabPanelProps(i)}>
				{tabIndex === i && tabOption.content()}
			</div>,
		);
	}

	return (
		<Zoom in={open}>
			<div className={classes.root}>
				<Paper square>
					{tabsList.length > 1 ? (
						<Tabs
							value={tabIndex}
							onChange={handleChange}
							variant="fullWidth"
							classes={{ indicator: classes.indicator }}
						>
							{tabsList}
						</Tabs>
					) : null}
				</Paper>
				{tabsContent}
			</div>
		</Zoom>
	);
}

TV.propTypes = {
	tabs: PropTypes.array,
	listView: PropTypes.bool,
};

export default TV;
