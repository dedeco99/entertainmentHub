import React, { useState, useEffect } from "react";

import {
	makeStyles,
	Zoom,
	Tabs,
	Tab,
	List,
	ListItem,
	Paper,
	Typography,
	Box,
	Grid,
	LinearProgress,
	Card,
	CardActionArea,
	Chip,
} from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";

import Loading from "../.partials/Loading";
import CustomScrollbar from "../.partials/CustomScrollbar";

import { getSeasons, getPopular } from "../../api/tv";
import { formatDate } from "../../utils/utils";

import { tv as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function TV() {
	const classes = useStyles();
	const [tabIndex, setTabIndex] = useState(0);
	const [inQueueEpisodes, setInQueueEpisodes] = useState([]);
	const [allEpisodes, setAllEpisodes] = useState([]);
	const [popular, setPopular] = useState([]);
	const [popularFilter, setPopularFilter] = useState("tv");
	const [popularLoading, setPopularLoading] = useState(true);
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
	}, []); // eslint-disable-line

	function handleChange(event, newValue) {
		setTabIndex(newValue);
	}

	function handlePopularFilter(e, value) {
		if (value && value !== popularFilter) {
			setPopular([]);
			setPopularLoading(true);
			setPopularFilter(value);
		}
	}

	useEffect(() => {
		async function fetchPopularData() {
			const { data } = await getPopular(0, "imdb", popularFilter);
			setPopular(data);
			setPopularLoading(false);
		}

		fetchPopularData();
	}, [popularFilter]);

	/*
	function getTrendIcon(trend) {
		if (Number(trend) > 0) return "icon-caret-up";
		else if (Number(trend) < 0) return "icon-caret-down";
		else return "icon-sunrise";
	}
	
		<Box position="absolute" top="0" left="0" width="100%" p={1}>
			<Chip color="primary" size="small" label={`${serie.rank}º`} />
			<Chip
				color="primary"
				size="small"
				icon={<i className={getTrendIcon(serie.trend)} />}
				label={Number.isInteger(serie.trend) ? serie.trend : serie.trend.substring(1)}
				className={classes.trendingChip}
				classes={{ labelSmall: classes.trendingChipLabel }}
			/>
		</Box>
	*/

	// TODO: Change icons
	function renderPopularList() {
		const popularList = popular.map(serie => (
			<Grid item key={serie.externalId} style={{ padding: "8px" }}>
				<Box display="flex" flexDirection="column" width="130px" height="100%">
					<Card component={Box} mb={1}>
						<CardActionArea
							onClick={() => {
								// TODO: Change this onclick to our own series page
								const newWindow = window.open(
									`https://www.imdb.com/title/${serie.externalId}`,
									"_blank",
									"noopener,noreferrer",
								);
								if (newWindow) newWindow.opener = null;
							}}
						>
							<Box>
								<img style={{ display: "block", width: "100%" }} src={serie.image} alt="Serie poster" />
								<LinearProgress
									variant="determinate"
									value={1} // TODO: Watched %
									className={classes.watchedProgressBar}
								/>
							</Box>
						</CardActionArea>
					</Card>
					<Typography variant="body2" style={{ display: "flex", flexGrow: 1 }}>
						{serie.displayName}
					</Typography>
					<Box display="flex" alignItems="center">
						<Typography variant="caption" style={{ display: "flex", flexGrow: 1, color: "#aeaeae" }}>
							{serie.year}
						</Typography>
						<Box display="flex" color="#f37555" pr={1}>
							<i className="icon-sunrise" />
						</Box>
						<Box display="flex" color="#f37555" pr={1}>
							<i className="icon-sunrise" />
						</Box>
						<Box display="flex" alignItems="center" color="#fbc005">
							<i className="icon-sunrise" style={{ paddingRight: "5px" }} />
							<Typography variant="caption"> {serie.rating} </Typography>
						</Box>
					</Box>
				</Box>
			</Grid>
		));

		return (
			<CustomScrollbar>
				<Box display="flex" alignItems="center" justifyContent="center" py={2}>
					<ToggleButtonGroup value={popularFilter} onChange={handlePopularFilter} color="primary" exclusive>
						<ToggleButton value="tv" color="primary" variant="outlined">
							{"TV"}
						</ToggleButton>
						<ToggleButton value="movies" color="primary" variant="outlined">
							{"Movies"}
						</ToggleButton>
					</ToggleButtonGroup>
				</Box>
				{popularLoading ? (
					<Loading />
				) : (
					<Grid container justify="center">
						{popularList}
					</Grid>
				)}
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
						<Tab label="In Queue" className={classes.tab} {...a11yTabProps(0)} />
						<Tab label="All" className={classes.tab} {...a11yTabProps(1)} />
						<Tab label="Popular" className={classes.tab} {...a11yTabProps(2)} />
						<Tab label="Future" className={classes.tab} {...a11yTabProps(3)} />
					</Tabs>
				</Paper>
				<div role="tabpanel" hidden={tabIndex !== 0} className={classes.tabPanel} {...a11yTabPanelProps(0)}>
					{tabIndex === 0 && renderEpisodeList(inQueueEpisodes)}
				</div>
				<div role="tabpanel" hidden={tabIndex !== 1} className={classes.tabPanel} {...a11yTabPanelProps(1)}>
					{tabIndex === 1 && renderEpisodeList(allEpisodes)}
				</div>
				<div role="tabpanel" hidden={tabIndex !== 2} className={classes.tabPanel} {...a11yTabPanelProps(2)}>
					{tabIndex === 2 && renderPopularList()}
				</div>
				<div role="tabpanel" hidden={tabIndex !== 3} className={classes.tabPanel} {...a11yTabPanelProps(3)}>
					{tabIndex === 3 && renderEpisodeList(future)}
				</div>
			</div>
		</Zoom>
	);
}

export default TV;
