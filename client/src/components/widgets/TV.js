import React, { useState, useEffect } from "react";

import { makeStyles, Zoom, Tabs, Tab, List, ListItem, Paper, Typography, Box } from "@material-ui/core";

import Loading from "../.partials/Loading";
import CustomScrollbar from "../.partials/CustomScrollbar";

import { getSeasons, getPopular } from "../../api/tv";
import { formatDate } from "../../utils/utils";

import { tv as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function TV() {
	const classes = useStyles();
	const [tabIndex, setTabIndex] = useState(0);
	const [allEpisodes, setAllEpisodes] = useState([]);
	const [popular, setPopular] = useState([]);
	const [future, setFuture] = useState([]);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		async function fetchData() {
			const response = await Promise.all([
				getSeasons("all", 0, "passed"),
				getPopular(0),
				getSeasons("all", 0, "future"),
			]);

			setAllEpisodes(response[0].data);
			setPopular(response[1].data);
			setFuture(response[2].data);
			setOpen(true);
		}

		fetchData();
	}, []); // eslint-disable-line

	function handleChange(event, newValue) {
		setTabIndex(newValue);
	}

	function renderPopularList() {
		const popularList = popular.map(serie => (
			<ListItem key={serie.externalId} button divider>
				<img src={serie.image} height="100x" alt="Series" />
				<Typography variant="body1" className={classes.popularText}>
					{serie.displayName}
				</Typography>
			</ListItem>
		));

		return (
			<CustomScrollbar>
				<List>{popularList}</List>
			</CustomScrollbar>
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

	return (
		<Zoom in={open}>
			<div className={classes.root}>
				<Paper square>
					<Tabs
						value={tabIndex}
						onChange={handleChange}
						variant="fullWidth"
						classes={{ indicator: classes.indicator }}
					>
						<Tab label="All" className={classes.tab} {...a11yTabProps(0)} />
						<Tab label="Popular" className={classes.tab} {...a11yTabProps(1)} />
						<Tab label="Future" className={classes.tab} {...a11yTabProps(2)} />
					</Tabs>
				</Paper>
				<div role="tabpanel" hidden={tabIndex !== 0} className={classes.tabPanel} {...a11yTabPanelProps(0)}>
					{tabIndex === 0 && renderEpisodeList(allEpisodes)}
				</div>
				<div role="tabpanel" hidden={tabIndex !== 1} className={classes.tabPanel} {...a11yTabPanelProps(1)}>
					{tabIndex === 1 && renderPopularList()}
				</div>
				<div role="tabpanel" hidden={tabIndex !== 2} className={classes.tabPanel} {...a11yTabPanelProps(2)}>
					{tabIndex === 2 && renderEpisodeList(future)}
				</div>
			</div>
		</Zoom>
	);
}

export default TV;
