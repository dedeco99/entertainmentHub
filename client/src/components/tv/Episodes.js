import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles, Grid, Button } from "@material-ui/core";

import Categories from "../.partials/Categories";
import Loading from "../.partials/Loading";
import Episode from "./Episode";

import { getSeasons } from "../../api/tv";

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

	async function handleGetAll() {
		if (!loading) {
			setLoading(true);
			if (page === 0) setOpen(false);

			const response = await getSeasons("all", page, filter);

			const newEpisodes = page === 0 ? response.data : episodes.concat(response.data);

			setEpisodes(newEpisodes);
			setPage(page + 1);
			setHasMore(!(response.data.length < 50));
			setLoading(false);
			if (page === 0) setOpen(true);
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

		if (response.status === 200) {
			setSeasons(response.data);
			setPage(0);

			setOpen(true);
		}
	}

	function handleGetInfo(seriesId, season) {
		if (season && seasons.length) {
			handleGetEpisodes(season);
		} else {
			handleGetSeasons(seriesId);
		}
	}

	function handleGetPassedEpisodes() {
		if (filter !== "passed") {
			setSeasons([]);
			setEpisodes([]);
			setPage(0);
			setFilter("passed");
		}
	}

	function handleGetFutureEpisodes() {
		if (filter !== "future") {
			setSeasons([]);
			setEpisodes([]);
			setPage(0);
			setFilter("future");
		}
	}

	useEffect(() => {
		switch (match.path) {
			case "/tv/all":
				handleGetAll();
				break;
			case "/tv/:seriesId":
				handleGetInfo(match.params.seriesId);
				break;
			case "/tv/:seriesId/:season":
				handleGetInfo(match.params.seriesId, Number(match.params.season));
				break;
			default:
				break;
		}
	}, [match.url]); // eslint-disable-line

	useEffect(() => {
		if (seasons.length) {
			if (match.params.season) {
				handleGetEpisodes(Number(match.params.season));
			} else {
				history.replace(`/tv/${match.params.seriesId}/${seasons[seasons.length - 1]._id}`);
			}
		} else if (filter !== "all") {
			handleGetAll();
		}
	}, [seasons.length, filter]); // eslint-disable-line

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
				<div className={classes.noEpisodes}>{"No episodes"}</div>
			</Grid>
		);
	}

	function renderAllEpisodes() {
		return (
			<Grid container spacing={2}>
				<Grid item sm={3} md={2}>
					<Button
						onClick={handleGetPassedEpisodes}
						className={classes.episodesBtn}
						color="primary"
						variant="outlined"
						fullWidth
					>
						{"Passed"}
					</Button>
				</Grid>
				<Grid item sm={3} md={2}>
					<Button
						onClick={handleGetFutureEpisodes}
						className={classes.episodesBtn}
						color="primary"
						variant="outlined"
						fullWidth
					>
						{"Future"}
					</Button>
				</Grid>
				<Grid item xs={12}>
					<InfiniteScroll loadMore={handleGetAll} hasMore={hasMore} loader={<Loading key={0} />}>
						<Grid container spacing={2}>
							{renderEpisodes()}
						</Grid>
					</InfiniteScroll>
				</Grid>
			</Grid>
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
