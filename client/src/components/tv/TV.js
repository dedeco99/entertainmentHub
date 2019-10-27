import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";

import { getSeries, getSeasons, getEpisodes, getSearch, addSeries } from "../../actions/tv";

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
		};

		this.getSeries = this.getSeries.bind(this);
		this.getSeasons = this.getSeasons.bind(this);
		this.getEpisodes = this.getEpisodes.bind(this);
		this.getSearch = this.getSearch.bind(this);
		this.addSeries = this.addSeries.bind(this);
		this.showComponent = this.showComponent.bind(this);
	}

	componentDidMount() {
		this.getSeries();
	}

	async getSeries() {
		const response = await getSeries();
		this.setState({ series: response.data });
	}

	async getSeasons(series) {
		const response = await getSeasons(series);
		this.setState({ seasons: response.data, currentSeries: series });

		this.getEpisodes(response.data[response.data.length - 1].season);
	}

	async getEpisodes(season) {
		this.showComponent("episodesBlock");

		const response = await getEpisodes(this.state.currentSeries, season);
		this.setState({ episodes: response.data });
	}

	async getSearch(search) {
		const response = await getSearch(search);
		this.setState({ search: response.data });
	}

	async addSeries(id) {
		const response = await addSeries(this.state.search[id]);
		this.setState({ series: response.data });
	}

	showComponent(component) {
		const components = ["episodesBlock", "seriesSearchBlock"];

		components.forEach(component => {
			document.getElementById(component).style.display = "none";
		});

		document.getElementById(component).style.display = "block";
	}

	render() {
		const { series, seasons, episodes, search } = this.state;

		return (
			<Grid container spacing={2}>
				<Grid item sm={3} md={2}>
					<div align="center">
						<Fab
							onClick={() => this.showComponent("seriesSearchBlock")}
							variant="extended"
							size="medium"
							style={{ width: "100%", backgroundColor: "#222" }}
						>
							<i className="material-icons">search</i>
							Search
						</Fab>
						<Button
							onClick={() => this.getSeasons("all")}
							style={{ color: "white", borderColor: "white", marginTop: 10, marginBottom: 10 }}
							variant="outlined"
							fullWidth
						>
							All
						</Button>
					</div>
					<Sidebar
						options={series}
						idField="seriesId"
						action={this.getSeasons}
					/>
				</Grid>
				<Grid item sm={9} md={10} lg={10}>
					<div id="seriesSearchBlock">
						<Search search={search} getSearch={this.getSearch} addSeries={this.addSeries} />
					</div>
					<div id="episodesBlock">
						<Categories
							options={seasons}
							idField="season"
							nameField="season"
							action={this.getEpisodes}
						/>
						<br />
						<Episodes episodes={episodes} />
					</div>
				</Grid>
			</Grid>
		);
	}
}

export default TV;
