import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles, Grid } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";

import Categories from "../.partials/Categories";
import Loading from "../.partials/Loading";
import Episode from "./Episode";

import { getSeasons } from "../../api/tv";

import { translate } from "../../utils/translations";

import { episodes as styles } from "../../styles/TV";

const useStyles = makeStyles(styles);

function Episodes() {
	const history = useHistory();
	const match = useRouteMatch();
	const classes = useStyles();
	const [seasons, setSeasons] = useState([]);
	const [episodes, setEpisodes] = useState([]);
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(false);
	const [filter, setFilter] = useState("all");
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [currentSeries, setCurrentSeries] = useState(null);
	let isMounted = true;

	async function handleGetAll() {
		if (!loading) {
			setLoading(true);
			if (page === 0) setOpen(false);

			const response = await getSeasons(filter, page, filter);

			if (response.status === 200 && isMounted) {
				const newEpisodes = page === 0 ? response.data : episodes.concat(response.data);

				setEpisodes(newEpisodes);
				setPage(page + 1);
				setHasMore(!(response.data.length < 50));
				setLoading(false);
				if (page === 0) setOpen(true);
			}
		}
	}

	function updateUrlFilter(seriesId, season) {
		history.push(`/tv/${seriesId}/${season}`);
	}

	function handleSeasonClick(season) {
		if (Number(match.params.season) !== season) updateUrlFilter(match.params.seriesId, season);
	}

	function handleGetEpisodes(season) {
		const foundSeason = seasons.find(s => s._id === Number(season));

		if (foundSeason) setEpisodes(foundSeason.episodes);
	}

	async function handleGetSeasons(seriesId) {
		setOpen(false);

		const response = await getSeasons(seriesId);

		if (response.status === 200 && isMounted) {
			setCurrentSeries(seriesId);
			setSeasons(response.data);
			setPage(0);

			setOpen(true);
		}
	}

	async function handleGetInfo(seriesId, season) {
		if (season && seasons.length && currentSeries === seriesId) {
			handleGetEpisodes(season);
		} else {
			await handleGetSeasons(seriesId);
		}
	}

	function handleFilterEpisodes(e, value) {
		if (value && value !== filter) {
			setSeasons([]);
			setEpisodes([]);
			setPage(0);
			setFilter(value);
		}
	}

	useEffect(() => {
		async function fetchData() {
			switch (match.path) {
				case "/tv/all":
					await handleGetAll();
					break;
				case "/tv/:seriesId":
					await handleGetInfo(match.params.seriesId);
					break;
				case "/tv/:seriesId/:season":
					await handleGetInfo(match.params.seriesId, Number(match.params.season));
					break;
				default:
					break;
			}
		}

		fetchData();
	}, [match.url]); // eslint-disable-line

	useEffect(() => {
		async function fetchData() {
			if (seasons.length) {
				if (match.params.season) {
					handleGetEpisodes(Number(match.params.season));
				} else {
					history.replace(`/tv/${match.params.seriesId}/${seasons[seasons.length - 1]._id}`);
				}
			} else {
				await handleGetAll();
			}
		}

		fetchData();

		return () => (isMounted = false); // eslint-disable-line
	}, [seasons, filter]); // eslint-disable-line

	function renderEpisodes() {
		if (episodes && episodes.length) {
			return episodes.map(episode => (
				<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={episode._id}>
					<Episode episode={episode} />
				</Grid>
			));
		}

		return (
			<Grid item xs={12} key={1}>
				<div className={classes.noEpisodes}>{translate("noEpisodes")}</div>
			</Grid>
		);
	}

	function renderAllEpisodes() {
		return (
			<div align="center">
				<ToggleButtonGroup value={filter} onChange={handleFilterEpisodes} color="primary" exclusive>
					<ToggleButton value="all" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("all")}
					</ToggleButton>
					<ToggleButton value="passed" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("releasedEpisodes")}
					</ToggleButton>
					<ToggleButton value="future" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("upcomingEpisodes")}
					</ToggleButton>
					<ToggleButton value="watched" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("watchedEpisodes")}
					</ToggleButton>
					<ToggleButton value="toWatch" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("toWatchEpisodes")}
					</ToggleButton>
					<ToggleButton value="queue" className={classes.episodeBtn} color="primary" variant="outlined">
						{translate("inQueue")}
					</ToggleButton>
				</ToggleButtonGroup>
				<InfiniteScroll loadMore={handleGetAll} hasMore={hasMore} loader={<Loading key={0} />}>
					<Grid container spacing={2}>
						{renderEpisodes()}
					</Grid>
				</InfiniteScroll>
			</div>
		);
	}

	function renderSeasons() {
		return (
			<div>
				<Categories
					options={seasons}
					idField="_id"
					nameField="_id"
					action={handleSeasonClick}
					selected={Number(match.params.season)}
				/>
				<br />
				<Grid container spacing={2} className={classes.episodeListContainer}>
					{renderEpisodes()}
				</Grid>
			</div>
		);
	}

	if (!open) return <Loading />;

	if (match.path === "/tv/all") return renderAllEpisodes();

	return renderSeasons();
}

export default Episodes;
