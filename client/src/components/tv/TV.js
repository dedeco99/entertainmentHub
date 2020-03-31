import React, { Component } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import Modal from "@material-ui/core/Modal";
import InfiniteScroll from "react-infinite-scroller";

import { getSeries, getSeasons, getPopular, getSearch, addSeries, editSeries, deleteSeries } from "../../actions/tv";

import Sidebar from "../.partials/Sidebar";
import Input from "../.partials/Input";
import Episodes from "./Episodes";
import SeriesDetail from "./SeriesDetail";

import "../../css/TV.css";

import loadingGif from "../../img/loading3.gif";
import placeholder from "../../img/noimage.png";
import goBackUp from "../../img/go_back_up.png";

class TV extends Component {
	constructor() {
		super();
		this.state = {
			series: [],
			seasons: [],
			episodes: [],
			search: [],
			popular: [],
			query: "",

			currentSeries: "all",
			allPage: 0,
			allHasMore: false,
			searchPage: 0,
			searchHasMore: false,
			popularPage: 0,
			popularHasMore: false,
			episodeFilter: "all",

			showSearchBlock: false,
			showPopularBlock: false,
			showEpisodesBlock: false,
			showGoBackUpButton: false,
			showModal: false,

			loadingSeries: false,
			loadingSearch: false,
			loadingPopular: false,
			loadingAll: false,
		};

		this.getAll = this.getAll.bind(this);
		this.getSeasons = this.getSeasons.bind(this);
		this.getEpisodes = this.getEpisodes.bind(this);
		this.filterEpisodes = this.filterEpisodes.bind(this);

		this.getPopular = this.getPopular.bind(this);
		this.getSearch = this.getSearch.bind(this);

		this.addSeries = this.addSeries.bind(this);
		this.editSeries = this.editSeries.bind(this);
		this.deleteSeries = this.deleteSeries.bind(this);

		this.handleSearch = this.handleSearch.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);

		this.showSearchBlock = this.showSearchBlock.bind(this);
		this.showPopularBlock = this.showPopularBlock.bind(this);
		this.showAllBlock = this.showAllBlock.bind(this);
		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);

		this.renderSearchBlock = this.renderSearchBlock.bind(this);
		this.renderPopularBlock = this.renderPopularBlock.bind(this);
		this.renderAddIcon = this.renderAddIcon.bind(this);
		this.renderEpisodesBlock = this.renderEpisodesBlock.bind(this);
		this.renderGoBackUpButton = this.renderGoBackUpButton.bind(this);
	}

	async componentDidMount() {
		this.setState({ loadingSeries: true });

		const response = await getSeries();

		this.setState({ loadingSeries: false, series: response.data });

		window.addEventListener("scroll", () => {
			const { showGoBackUpButton } = this.state;

			const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

			const height = document.documentElement.scrollHeight -
				document.documentElement.clientHeight;

			const scrolled = winScroll / height;

			if (scrolled > 0.75 && !showGoBackUpButton) {
				this.setState({ showGoBackUpButton: true });
			} else if (scrolled === 0) {
				this.setState({ showGoBackUpButton: false });
			}
		});
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

	async getSeasons(series) {
		const response = await getSeasons(series);

		this.setState({ seasons: response.data, currentSeries: series, allPage: 0 });

		this.getEpisodes(response.data[response.data.length - 1]._id);
	}

	getEpisodes(season) {
		const { seasons } = this.state;

		const foundSeason = seasons.find(s => s._id === season);

		if (foundSeason) {
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

	async getSearch() {
		const { search, query, searchPage, loadingSearch } = this.state;

		if (!loadingSearch) {
			this.setState({ loadingSearch: true });

			const response = await getSearch(query, searchPage);

			const newSearch = searchPage === 0 ? response.data : search.concat(response.data);

			this.setState({
				search: newSearch,
				searchPage: searchPage + 1,
				searchHasMore: !(response.data.length < 20),
				loadingSearch: false,
			});
		}
	}

	async addSeries(series) {
		const { search, popular } = this.state;

		this.setState({ loadingAddSeries: true });

		let newSeries = series;
		if (!series.displayName) {
			let found = search.find(s => s.id.toString() === series.target.id);
			if (!found) found = popular.find(s => s.id.toString() === series.target.id);
			newSeries = found;
		}

		const response = await addSeries(newSeries);
		if (response.status < 400) {
			this.setState({ series: response.data });

			toast.success(response.message);
		} else {
			toast.error(response.message);
		}

		this.setState({ loadingAddSeries: false });
	}

	async editSeries(id, series) {
		const response = await editSeries(id, series);
		if (response.status < 400) {
			this.setState({ series: response.data });

			toast.success(response.message);
		} else {
			toast.error(response.message);
		}
	}


	async deleteSeries(e) {
		const response = await deleteSeries(e.target.id);
		if (response.status < 400) {
			this.setState({ series: response.data });

			toast.success(response.message);
		} else {
			toast.error(response.message);
		}
	}

	handleSearch(e) {
		this.setState({ query: e.target.value, searchPage: 0 });
	}

	handleKeyPress(event) {
		if (event.key === "Enter") this.getSearch();
	}

	showSearchBlock() {
		this.setState({ showSearchBlock: true, showPopularBlock: false, showEpisodesBlock: false });
	}

	showPopularBlock() {
		this.setState({
			popular: [],
			popularPage: 0,
			popularHasMore: false,
			showSearchBlock: false,
			showPopularBlock: true,
			showEpisodesBlock: false,
		}, this.getPopular);
	}

	showAllBlock() {
		this.setState({
			episodes: [],
			allPage: 0,
			allHasMore: false,
			showSearchBlock: false,
			showPopularBlock: false,
			showEpisodesBlock: true,
		}, this.getAll);
	}

	showModal(e, type) {
		const { search, popular, series } = this.state;

		if (type === "edit") {
			this.setState({
				currentSeries: series.find(s => s.seriesId === e.target.id),
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

	hideModal() {
		this.setState({ showModal: false });
	}

	renderButtons() {
		const { loadingPopular, loadingAll } = this.state;

		return (
			<div align="center">
				<Fab
					onClick={this.showSearchBlock}
					variant="extended"
					size="medium"
					style={{ width: "100%", backgroundColor: "#222" }}
				>
					<i className="material-icons">{"search"}</i>
					{"Search"}
				</Fab>
				<Button
					onClick={this.showPopularBlock}
					className="outlined-button"
					style={{ marginTop: 10, marginBottom: 10 }}
					variant="outlined"
					fullWidth
				>
					{loadingPopular ? <img src={loadingGif} height="25px" alt="Loading..." /> : "Popular"}
				</Button>
				<Button
					onClick={this.showAllBlock}
					className="outlined-button"
					style={{ marginTop: 10, marginBottom: 10 }}
					variant="outlined"
					fullWidth
				>
					{loadingAll ? <img src={loadingGif} height="25px" alt="Loading..." /> : "All"}
				</Button>
			</div>
		);
	}

	renderSearchBlock() {
		const { search, query, searchHasMore, showSearchBlock, loadingSearch } = this.state;

		if (showSearchBlock) {
			return (
				<div>
					<Input
						id="search"
						label="Search"
						value={query}
						onChange={this.handleSearch}
						onKeyPress={this.handleKeyPress}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									{
										loadingSearch
											? <img src={loadingGif} height="25px" alt="Loading..." />
											: <div />
									}
								</InputAdornment>
							),
						}}
						margin="normal"
						variant="outlined"
						fullWidth
					/>
					<InfiniteScroll
						pageStart={0}
						loadMore={this.getSearch}
						hasMore={searchHasMore}
					>
						{this.renderSeriesBlock(search)}
					</InfiniteScroll>
				</div>
			);
		}

		return <div />;
	}

	renderPopularBlock() {
		const { popular, popularHasMore, showPopularBlock } = this.state;

		if (showPopularBlock) {
			return (
				<InfiniteScroll
					pageStart={0}
					loadMore={this.getPopular}
					hasMore={popularHasMore}
				>
					{this.renderSeriesBlock(popular)}
				</InfiniteScroll>
			);
		}

		return <div />;
	}

	renderAddIcon(s) {
		const { series, loadingAddSeries } = this.state;

		const seriesIds = series.map(us => us.seriesId);

		if (loadingAddSeries) {
			return (
				<span className="add-series-icon">
					<img src={loadingGif} height="48px" alt="Loading..." />
				</span>
			);
		} else if (!seriesIds.includes(s.id.toString())) {
			return (
				<i
					id={s.id}
					className="add-series-icon icofont-ui-add icofont-3x"
					onClick={this.addSeries}
				/>
			);
		}

		return null;
	}

	renderSeriesBlock(series) {
		if (series && series.length > 0) {
			return (
				<Grid container spacing={2}>
					{
						series.map(s => {
							return (
								<Grid
									item xs={12} sm={4} md={4} lg={4} xl={3}
									key={s.id}
								>
									<div className="add-series-container">
										{this.renderAddIcon(s)}
										<img
											src={s.image.substr(s.image.length - 4) === "null" ? placeholder : s.image}
											width="100%"
											alt={s.displayName}
										/>
									</div>
								</Grid>
							);
						})
					}
				</Grid>
			);
		}

		return <div />;
	}

	filterEpisodes(filter) {
		this.setState({ episodeFilter: filter, episodes: [] });

		this.showAllBlock();
	}

	renderEpisodesBlock() {
		const {
			currentSeries,
			seasons,
			episodes,
			allHasMore,
			showEpisodesBlock,
		} = this.state;

		if (showEpisodesBlock) {
			return (
				<Episodes
					currentSeries={currentSeries}
					seasons={seasons}
					episodes={episodes}
					getEpisodes={this.getEpisodes}
					getAll={this.getAll}
					allHasMore={allHasMore}
					filterEpisodes={this.filterEpisodes}
				/>
			);
		}

		return null;
	}

	goBackUp() {
		window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
	}

	renderGoBackUpButton() {
		const { showGoBackUpButton } = this.state;

		if (showGoBackUpButton) {
			return (
				<div className="go-back-up" onClick={this.goBackUp}>
					<img src={goBackUp} width="50px" alt="Go Back Up" />
				</div>
			);
		}

		return null;
	}

	render() {
		const { loadingSeries, series, currentSeries, showModal } = this.state;

		const menuOptions = [
			{ displayName: "Edit", onClick: e => this.showModal(e, "edit") },
			{ displayName: "Delete", onClick: this.deleteSeries },
		];

		return (
			<Grid container spacing={2}>
				<Grid item sm={3} md={2}>
					{this.renderButtons()}
					<Sidebar
						options={series}
						idField="seriesId"
						action={this.getSeasons}
						menu={menuOptions}
						loading={loadingSeries}
						noResultsMessage={"No series"}
					/>
				</Grid>
				<Grid item sm={9} md={10} lg={10}>
					{this.renderSearchBlock()}
					{this.renderPopularBlock()}
					{this.renderEpisodesBlock()}
				</Grid>
				{this.renderGoBackUpButton()}
				<Modal
					open={showModal}
					onClose={this.hideModal}
				>
					<SeriesDetail
						type={currentSeries.seriesId ? "edit" : "add"}
						series={currentSeries.id || currentSeries.seriesId ? currentSeries : {}}
						addSeries={this.addSeries}
						editSeries={this.editSeries}
					/>
				</Modal>
			</Grid>
		);
	}
}

export default TV;
