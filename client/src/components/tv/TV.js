import React, { Component } from "react";
import { withStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";

import Sidebar from "../.partials/Sidebar";
import SeriesDetail from "./SeriesDetail";
import Episodes from "./Episodes";
import Search from "./Search";
import Banners from "./Banners";

import { getSeries, getSeasons, getPopular, addSeries, editSeries, deleteSeries } from "../../api/tv";

import loadingGif from "../../img/loading3.gif";

import { tv as styles } from "../../styles/TV";

class TV extends Component {
	constructor() {
		super();
		this.state = {
			series: [],
			seasons: [],
			episodes: [],
			popular: [],

			currentSeries: "all",
			allPage: 0,
			allHasMore: false,
			popularPage: 0,
			popularHasMore: false,
			episodeFilter: "all",

			showSearchBlock: false,
			showPopularBlock: false,
			showEpisodesBlock: false,
			showModal: false,

			loadingSeries: false,
			loadingPopular: false,
			loadingAll: false,

			urlParams: {},
		};

		this.getAll = this.getAll.bind(this);
		this.getSeasons = this.getSeasons.bind(this);
		this.getEpisodes = this.getEpisodes.bind(this);
		this.filterEpisodes = this.filterEpisodes.bind(this);

		this.getPopular = this.getPopular.bind(this);

		this.addSeries = this.addSeries.bind(this);
		this.editSeries = this.editSeries.bind(this);
		this.deleteSeries = this.deleteSeries.bind(this);

		this.handleShowSearchBlock = this.handleShowSearchBlock.bind(this);
		this.handleShowPopularBlock = this.handleShowPopularBlock.bind(this);
		this.handleShowAllBlock = this.handleShowAllBlock.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
		this.handleHideModal = this.handleHideModal.bind(this);
	}

	async componentDidMount() {
		await this.getSeries();

		this.applyUrlFilters();
	}

	applyUrlFilters() {
		const { match } = this.props;

		switch (match.path) {
			case "/tv/all":
				this.handleShowAllBlock();
				break;
			case "/tv/popular":
				this.handleShowPopularBlock();
				break;
			case "/tv/:seriesId":
				this.getSeasons(match.params.seriesId);
				break;
			case "/tv/:seriesId/:season":
				this.getSeasons(match.params.seriesId, Number(match.params.season));
				break;
			default:
				break;
		}

		this.setState({ urlParams: match.params });
	}

	updateUrlFilter(urlParams) {
		const { history } = this.props;

		if (urlParams.seriesId) {
			if (urlParams.season >= 0) {
				history.push(`/tv/${urlParams.seriesId}/${urlParams.season}`);
			} else {
				history.push(`/tv/${urlParams.seriesId}`);
			}
		}
	}

	updateSeriesPath(series) {
		const { urlParams } = this.state;

		urlParams.seriesId = series;

		this.setState({ urlParams });

		this.updateUrlFilter(urlParams);
	}

	updateSeasonPath(season) {
		const { urlParams } = this.state;

		urlParams.season = season;

		this.setState({ urlParams });

		this.updateUrlFilter(urlParams);
	}

	async getSeries() {
		this.setState({ loadingSeries: true });

		const response = await getSeries();

		this.setState({ loadingSeries: false, series: response.data });
	}

	async getAll() {
		const { episodes, allPage, episodeFilter, loadingAll } = this.state;

		if (!loadingAll) {
			this.setState({ loadingAll: true });

			const response = await getSeasons("all", allPage, episodeFilter);

			const newEpisodes = allPage === 0 ? response.data : episodes.concat(response.data);

			this.setState({
				episodes: newEpisodes,
				currentSeries: "all",
				allPage: allPage + 1,
				allHasMore: !(response.data.length < 50),
				showSearchBlock: false,
				showPopularBlock: false,
				showEpisodesBlock: true,
				loadingAll: false,
			});
		}
	}

	async getSeasons(id, season) {
		const { series } = this.state;

		const seriesFound = series.find(s => s._id === id);
		const seriesId = seriesFound ? seriesFound.seriesId : id;

		const response = await getSeasons(seriesId);

		if (response.status === 200) {
			this.updateSeriesPath(seriesId);

			this.setState({ seasons: response.data, currentSeries: id, allPage: 0 }, () =>
				this.getEpisodes(season >= 0 ? season : response.data[response.data.length - 1]._id),
			);
		}
	}

	getEpisodes(season) {
		const { seasons } = this.state;

		const foundSeason = seasons.find(s => s._id === season);

		if (foundSeason) {
			this.updateSeasonPath(season);

			this.setState({
				episodes: foundSeason.episodes,
				showSearchBlock: false,
				showPopularBlock: false,
				showEpisodesBlock: true,
			});
		}
	}

	async getPopular() {
		const { popular, popularPage, loadingPopular } = this.state;

		if (!loadingPopular) {
			this.setState({ loadingPopular: true });

			const response = await getPopular(popularPage);

			const newPopular = popularPage === 0 ? response.data : popular.concat(response.data);

			this.setState({
				popular: newPopular,
				popularPage: popularPage + 1,
				popularHasMore: !(response.data.length < 20),
				showSearchBlock: false,
				showPopularBlock: true,
				showEpisodesBlock: false,
				loadingPopular: false,
			});
		}
	}

	async addSeries(series) {
		const response = await addSeries(series);

		if (response.status === 201) {
			this.setState(prevState => ({
				series: [...prevState.series, response.data].sort((a, b) => (a.displayName <= b.displayName ? -1 : 1)),
			}));
		}
	}

	async editSeries(id, series) {
		const response = await editSeries(id, series);

		if (response.status === 200) {
			this.setState(prevState => ({
				series: [...prevState.series.filter(s => s._id !== response.data._id), response.data].sort((a, b) =>
					a.displayName <= b.displayName ? -1 : 1,
				),
			}));
		}
	}

	async deleteSeries(e) {
		const { series } = this.state;

		const response = await deleteSeries(e.target.id);

		if (response.status === 200) {
			const updatedSeries = series.filter(s => s._id !== response.data._id);

			this.setState({ series: updatedSeries });
		}
	}

	handleShowSearchBlock() {
		this.setState({ showSearchBlock: true, showPopularBlock: false, showEpisodesBlock: false });
	}

	handleShowPopularBlock() {
		const { history } = this.props;

		history.push("/tv/popular");

		this.setState(
			{
				popular: [],
				popularPage: 0,
				popularHasMore: false,
				showSearchBlock: false,
				showPopularBlock: true,
				showEpisodesBlock: false,
			},
			this.getPopular,
		);
	}

	handleShowAllBlock() {
		const { history } = this.props;

		history.push("/tv/all");

		this.setState(
			{
				episodes: [],
				allPage: 0,
				allHasMore: false,
				showSearchBlock: false,
				showPopularBlock: false,
				showEpisodesBlock: true,
			},
			this.getAll,
		);
	}

	handleShowModal(e, type) {
		const { search, popular, series } = this.state;

		if (type === "edit") {
			this.setState({
				currentSeries: series.find(s => s._id === e.target.id),
				showModal: true,
			});
		} else {
			let found = search.find(s => s.id.toString() === e.target.id);
			if (!found) found = popular.find(s => s.id.toString() === e.target.id);

			this.setState({
				currentSeries: found,
				showModal: true,
			});
		}
	}

	handleHideModal() {
		this.setState({ showModal: false });
	}

	filterEpisodes(filter) {
		this.setState({ episodeFilter: filter, episodes: [] });

		this.handleShowAllBlock();
	}

	renderButtons() {
		const { classes } = this.props;
		const { loadingPopular, loadingAll } = this.state;

		return (
			<div align="center">
				<Fab onClick={this.handleShowSearchBlock} variant="extended" size="medium" className={classes.searchBtn}>
					<i className="material-icons">{"search"}</i>
					{"Search"}
				</Fab>
				<Button
					onClick={this.handleShowPopularBlock}
					className={classes.outlinedBtn}
					color="primary"
					variant="outlined"
					fullWidth
				>
					{loadingPopular ? <img src={loadingGif} height="25px" alt="Loading..." /> : "Popular"}
				</Button>
				<Button
					onClick={this.handleShowAllBlock}
					className={classes.outlinedBtn}
					color="primary"
					variant="outlined"
					fullWidth
				>
					{loadingAll ? <img src={loadingGif} height="25px" alt="Loading..." /> : "All"}
				</Button>
			</div>
		);
	}

	renderContent() {
		const {
			currentSeries,
			series,
			seasons,
			episodes,
			popular,
			allHasMore,
			popularHasMore,
			showSearchBlock,
			showPopularBlock,
			showEpisodesBlock,
			urlParams,
		} = this.state;

		if (showSearchBlock) {
			return <Search allSeries={series} addSeries={this.addSeries} />;
		} else if (showPopularBlock) {
			return (
				<Banners
					series={popular}
					getMore={this.getPopular}
					hasMore={popularHasMore}
					allSeries={series}
					addSeries={this.addSeries}
				/>
			);
		} else if (showEpisodesBlock) {
			return (
				<Episodes
					currentSeries={currentSeries}
					seasons={seasons}
					episodes={episodes}
					selectedSeason={Number(urlParams.season)}
					getEpisodes={this.getEpisodes}
					getAll={this.getAll}
					allHasMore={allHasMore}
					filterEpisodes={this.filterEpisodes}
				/>
			);
		}

		return <div />;
	}

	render() {
		const { loadingSeries, series, currentSeries, showModal, urlParams } = this.state;

		const menuOptions = [
			{ displayName: "Edit", onClick: e => this.handleShowModal(e, "edit") },
			{ displayName: "Delete", onClick: this.deleteSeries },
		];

		return (
			<Grid container spacing={2}>
				<Grid item sm={3} md={2}>
					{this.renderButtons()}
					<Sidebar
						options={series}
						idField="_id"
						action={this.getSeasons}
						menu={menuOptions}
						loading={loadingSeries}
						noResultsMessage={"No series"}
						initialSelected={urlParams.seriesId}
					/>
				</Grid>
				<Grid item sm={9} md={10} lg={10}>
					{this.renderContent()}
				</Grid>
				<SeriesDetail
					open={showModal}
					series={currentSeries._id && currentSeries}
					editSeries={this.editSeries}
					onClose={this.handleHideModal}
				/>
			</Grid>
		);
	}
}

TV.propTypes = {
	classes: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
};

export default withStyles(styles)(TV);
