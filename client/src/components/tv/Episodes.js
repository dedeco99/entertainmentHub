import React from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

import { makeStyles, Grid, Button } from "@material-ui/core";

import Categories from "../.partials/Categories";
import Episode from "./Episode";

import { episodes as styles } from "../../styles/TV";

const useStyles = makeStyles(styles);

function Episodes({
	currentSeries,
	seasons,
	episodes,
	getEpisodes,
	getAll,
	allHasMore,
	filterEpisodes,
	selectedSeason,
}) {
	const classes = useStyles();

	function handleGetPassedEpisodes() {
		filterEpisodes("passed");
	}

	function handleGetFutureEpisodes() {
		filterEpisodes("future");
	}

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

	function renderAllEpisodes(episodeList) {
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
					<InfiniteScroll pageStart={0} loadMore={getAll} hasMore={allHasMore}>
						<Grid container spacing={2}>
							{episodeList}
						</Grid>
					</InfiniteScroll>
				</Grid>
			</Grid>
		);
	}

	function renderSeasons(episodeList) {
		return (
			<div>
				<Categories
					options={seasons}
					idField="_id"
					nameField="_id"
					action={getEpisodes}
					initialSelected={selectedSeason}
				/>
				<br />
				<Grid container spacing={2} className={classes.episodeListContainer}>
					{episodeList}
				</Grid>
			</div>
		);
	}

	const episodeList = renderEpisodes();

	if (currentSeries === "all") return renderAllEpisodes(episodeList);

	return renderSeasons(episodeList);
}

Episodes.propTypes = {
	currentSeries: PropTypes.string.isRequired,
	seasons: PropTypes.array.isRequired,
	episodes: PropTypes.array.isRequired,
	getEpisodes: PropTypes.func.isRequired,
	getAll: PropTypes.func.isRequired,
	allHasMore: PropTypes.bool.isRequired,
	filterEpisodes: PropTypes.func.isRequired,
	selectedSeason: PropTypes.number,
};

export default Episodes;
