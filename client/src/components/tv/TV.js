import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";

import { getSeries, getSeasons, getSearch, addSeries } from "../../actions/tv";

import Sidebar from "../.partials/Sidebar";
import Categories from "../.partials/Categories";
import Episodes from "./Episodes";
import Search from "./Search";

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
		};

		this.getSeries = this.getSeries.bind(this);
		this.getAll = this.getAll.bind(this);
		this.getSeasons = this.getSeasons.bind(this);
		this.getEpisodes = this.getEpisodes.bind(this);
		this.getSearch = this.getSearch.bind(this);
		this.addSeries = this.addSeries.bind(this);
		this.showSearchBlock = this.showSearchBlock.bind(this);
	}

	componentDidMount() {
		this.getSeries();
	}

	async getSeries() {
		const response = await getSeries();
		this.setState({ series: response.data });
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

		if (foundSeason) this.setState({
			episodes: foundSeason.episodes,
			showSearchBlock: false,
			showEpisodesBlock: true,
		});
	}

	async getSearch(search) {
		const response = await getSearch(search);
		this.setState({ search: response.data });
	}

	async addSeries(id) {
		const { search } = this.state;

		const response = await addSeries(search[id]);
		if (response.status < 400) {
			this.setState({ series: response.data });

			toast.success(response.message);
		} else {
			toast.error(response.message);
		}
	}

	async updateSeries() {
		await getSeasons("cronjob");
	}

	showSearchBlock() {
		this.setState({ showSearchBlock: true, showEpisodesBlock: false });
	}

	render() {
		const { series, seasons, episodes, search, currentSeries, showSearchBlock, showEpisodesBlock } = this.state;

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
					/>
				</Grid>
				<Grid item sm={9} md={10} lg={10}>
					{showSearchBlock ?
						<Search
							search={search}
							getSearch={this.getSearch}
							addSeries={this.addSeries}
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
						</div>
						: null}
				</Grid>
				<ToastContainer
					position="bottom-right"
					newestOnTop
				/>
			</Grid>
		);
	}
}

export default TV;
