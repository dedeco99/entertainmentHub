import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";

import { getSeries, getSeasons, getSearch, addSeries, editSeries, deleteSeries } from "../../actions/tv";

import Sidebar from "../.partials/Sidebar";
import Categories from "../.partials/Categories";
import Episodes from "./Episodes";
import Search from "./Search";
import SeriesDetail from "./SeriesDetail";

import "../../css/TV.css";

class TV extends Component {
	constructor() {
		super();
		this.state = {
			series: [],
			seasons: [],
			episodes: [],
			search: [],

			currentSeries: "all",
			showEpisodesBlock: false,
			showSearchBlock: false,
			showModal: false,
		};

		this.getSeries = this.getSeries.bind(this);
		this.getAll = this.getAll.bind(this);
		this.getSeasons = this.getSeasons.bind(this);
		this.getEpisodes = this.getEpisodes.bind(this);
		this.getSearch = this.getSearch.bind(this);
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
				showEpisodesBlock: true,
			});
		}
	}

	async getSearch(search) {
		const response = await getSearch(search);
		this.setState({ search: response.data });
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
		const { series, seasons, episodes, search, currentSeries, showSearchBlock, showEpisodesBlock, showModal } = this.state;

		const menuOptions = [
			{ displayName: "Edit", onClick: e => this.showModal(e, "edit") },
			{ displayName: "Delete", onClick: this.deleteSeries },
		];

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
					{showSearchBlock ?
						<Search
							search={search}
							getSearch={this.getSearch}
							showModal={this.showModal}
						/>
						: null}
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
