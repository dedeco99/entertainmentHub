import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";

import { getSeries, getSeasons, getPopular, getSearch, addSeries, editSeries, deleteSeries } from "../../actions/tv";

import Sidebar from "../.partials/Sidebar";
import Categories from "../.partials/Categories";
import Input from "../.partials/Input";
import Episodes from "./Episodes";
import SeriesDetail from "./SeriesDetail";

import "../../css/TV.css";

import loading from "../../img/loading2.gif";
import placeholder from "../../img/noimage.png";

class TV extends Component {
	constructor() {
		super();
		this.state = {
			series: [],
			seasons: [],
			episodes: [],
			search: [],
			query: "",

			currentSeries: "all",
			showSearchBlock: false,
			showSeriesBlock: false,
			showEpisodesBlock: false,
			showModal: false,
		};

		this.getSeries = this.getSeries.bind(this);
		this.updateSeries = this.updateSeries.bind(this);
		this.getAll = this.getAll.bind(this);
		this.getSeasons = this.getSeasons.bind(this);
		this.getEpisodes = this.getEpisodes.bind(this);

		this.getPopular = this.getPopular.bind(this);
		this.getSearch = this.getSearch.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);

		this.addSeries = this.addSeries.bind(this);
		this.editSeries = this.editSeries.bind(this);
		this.deleteSeries = this.deleteSeries.bind(this);

		this.showSearchBlock = this.showSearchBlock.bind(this);
		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);
	}

	componentDidMount() {
		this.getSeries();
	}

	async getSeries() {
		const response = await getSeries();
		this.setState({ series: response.data });
	}

	async updateSeries() {
		await getSeasons("cronjob");
	}

	async getAll() {
		const response = await getSeasons("all");
		this.setState({
			episodes: response.data,
			currentSeries: "all",
			showSearchBlock: false,
			showSeriesBlock: false,
			showEpisodesBlock: true,
		});
	}

	async getSeasons(series) {
		const response = await getSeasons(series);
		this.setState({ seasons: response.data, currentSeries: series });

		this.getEpisodes(response.data[response.data.length - 1]._id);
	}

	getEpisodes(season) {
		const { seasons } = this.state;

		const foundSeason = seasons.find(s => s._id === season);

		if (foundSeason) {
			this.setState({
				episodes: foundSeason.episodes,
				showSearchBlock: false,
				showSeriesBlock: false,
				showEpisodesBlock: true,
			});
		}
	}

	async getPopular() {
		this.setState({ showSearchBlock: false, showSeriesBlock: true, showEpisodesBlock: false });

		const response = await getPopular();

		this.setState({ search: response.data });
	}

	async getSearch() {
		const { query } = this.state;

		const response = await getSearch(query);

		this.setState({ search: response.data, showSeriesBlock: true });
	}

	handleSearch(e) {
		this.setState({ query: e.target.value });
	}

	handleKeyPress(event) {
		if (event.key === "Enter") this.getSearch();
	}

	async addSeries(series) {
		const response = await addSeries(series);
		if (response.status < 400) {
			this.setState({ series: response.data });

			toast.success(response.message);
		} else {
			toast.error(response.message);
		}
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

	showSearchBlock() {
		this.setState({ showSearchBlock: true, showEpisodesBlock: false });
	}

	showModal(e, type) {
		const { search, series } = this.state;

		if (type === "edit") {
			this.setState({ currentSeries: series.find(s => s.seriesId === e.target.id), showModal: true });
		} else {
			this.setState({ currentSeries: search.find(s => s.id.toString() === e.target.id), showModal: true });
		}
	}

	hideModal() {
		this.setState({ showModal: false });
	}

	render() {
		const {
			series,
			seasons,
			episodes,
			search,
			query,
			currentSeries,
			showSearchBlock,
			showSeriesBlock,
			showEpisodesBlock,
			showModal,
		} = this.state;

		const menuOptions = [
			{ displayName: "Edit", onClick: e => this.showModal(e, "edit") },
			{ displayName: "Delete", onClick: this.deleteSeries },
		];

		let seriesList = <div className="loading" align="center"><img src={loading} alt="Loading..." /></div>;
		if (search && search.length > 0) {
			seriesList = search.map(series => (
				<Grid
					item xs={12} sm={6} md={4} lg={4} xl={3}
					key={series.id}
				>
					<div className="add-series-container">
						<i
							id={series.id}
							className="add-series-icon icofont-ui-add icofont-3x"
							onClick={this.showModal}
						/>
						<img src={series.image.substr(series.image.length - 4) === "null" ? placeholder : series.image} width="100%" alt={series.displayName} />
					</div>
				</Grid>
			));
		}

		return (
			<Grid container spacing={2}>
				<Grid item sm={3} md={2}>
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
							onClick={this.getPopular}
							className="outlined-button"
							style={{ marginTop: 10, marginBottom: 10 }}
							variant="outlined"
							fullWidth
						>
							{"popular"}
						</Button>
						<Button
							onClick={this.updateSeries}
							className="outlined-button"
							style={{ marginTop: 10, marginBottom: 10 }}
							variant="outlined"
							fullWidth
						>
							{"refresh"}
						</Button>
						<Button
							onClick={this.getAll}
							className="outlined-button"
							style={{ marginTop: 10, marginBottom: 10 }}
							variant="outlined"
							fullWidth
						>
							{"All"}
						</Button>
					</div>
					<Sidebar
						options={series}
						idField="seriesId"
						action={this.getSeasons}
						menu={menuOptions}
					/>
				</Grid>
				<Grid item sm={9} md={10} lg={10}>
					<Grid container spacing={2}>
						{showSearchBlock ?
							<Input
								id="search"
								label="Search"
								value={query}
								onChange={this.handleSearch}
								onKeyPress={this.handleKeyPress}
								margin="normal"
								variant="outlined"
								fullWidth
							/> : null}
						{showSeriesBlock ? seriesList : null}
					</Grid>
					{showEpisodesBlock ?
						<div id="episodesBlock">
							{
								currentSeries === "all" ? "" :
									<Categories
										options={seasons}
										idField="_id"
										nameField="_id"
										action={this.getEpisodes}
									/>
							}
							<br />
							<Episodes episodes={episodes} />
						</div> : null}
				</Grid>
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
				<ToastContainer
					position="bottom-right"
					newestOnTop
				/>
			</Grid>
		);
	}
}

export default TV;
