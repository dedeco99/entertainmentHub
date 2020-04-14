import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import InfiniteScroll from "react-infinite-scroller";

import Categories from "../.partials/Categories";
import Episode from "./Episode";

const styles = () => ({
	episodeListContainer: {
		width: "100%",
	},
	episodeBtn: {
		marginTop: 10,
		marginBottom: 10,
	},
	noEpisodes: {
		textAlign: "center",
	}
});

class Episodes extends Component {
	constructor() {
		super();

		this.getPassedEpisodes = this.getPassedEpisodes.bind(this);
		this.getFutureEpisodes = this.getFutureEpisodes.bind(this);
	}

	getPassedEpisodes() {
		const { filterEpisodes } = this.props;

		filterEpisodes("passed");
	}

	getFutureEpisodes() {
		const { filterEpisodes } = this.props;

		filterEpisodes("future");
	}

	renderEpisodes() {
		const { classes, episodes } = this.props;

		if (episodes && episodes.length) {
			return episodes.map(episode => (
				<Grid
					item xs={12} sm={6} md={4} lg={3} xl={2}
					key={episode._id}
				>
					<Episode episode={episode} />
				</Grid>
			));
		}

		return (
			<Grid
				item xs={12}
				key={1}
			>
				<div className={classes.noEpisodes}>{"No episodes"}</div>
			</Grid>
		);
	}

	renderAllEpisodes(episodeList) {
		const { classes, getAll, allHasMore } = this.props;

		return (
			<Grid container spacing={2}>
				<Grid item sm={3} md={2}>
					<Button
						onClick={this.getPassedEpisodes}
						className={`outlined-button ${classes.episodesBtn}`}
						variant="outlined"
						fullWidth
					>
						{"Passed"}
					</Button>
				</Grid>
				<Grid item sm={3} md={2}>
					<Button
						onClick={this.getFutureEpisodes}
						className={`outlined-button ${classes.episodesBtn}`}
						variant="outlined"
						fullWidth
					>
						{"Future"}
					</Button>
				</Grid>
				<Grid item xs={12}>
					<InfiniteScroll
						pageStart={0}
						loadMore={getAll}
						hasMore={allHasMore}
					>
						<Grid container spacing={2}>
							{episodeList}
						</Grid>
					</InfiniteScroll>
				</Grid>
			</Grid>
		);
	}

	renderSeasons(episodeList) {
		const { classes, seasons, getEpisodes } = this.props;

		return (
			<div>
				<Categories
					options={seasons}
					idField="_id"
					nameField="_id"
					action={getEpisodes}
				/>
				<br />
				<Grid container spacing={2} className={classes.episodeListContainer}>
					{episodeList}
				</Grid>
			</div>
		);
	}

	render() {
		const { currentSeries } = this.props;
		const episodeList = this.renderEpisodes();

		if (currentSeries === "all") return this.renderAllEpisodes(episodeList);

		return this.renderSeasons(episodeList);
	}
}

Episodes.propTypes = {
	classes: PropTypes.object.isRequired,
	currentSeries: PropTypes.string.isRequired,
	seasons: PropTypes.array.isRequired,
	episodes: PropTypes.array.isRequired,
	getEpisodes: PropTypes.func.isRequired,
	getAll: PropTypes.func.isRequired,
	allHasMore: PropTypes.bool.isRequired,
	filterEpisodes: PropTypes.func.isRequired,
};

export default withStyles(styles)(Episodes);
