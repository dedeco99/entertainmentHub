import React, { Component } from "react";

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

		this.showComponent("episodesBlock");
	}

	async getSeasons(series) {
		const response = await getSeasons(series);
		this.setState({ seasons: response.data, currentSeries: series });

		this.showComponent("episodesBlock");
	}

	async getEpisodes(season) {
		const response = await getEpisodes(this.state.currentSeries, season);
		this.setState({ episodes: response.data });

		this.showComponent("episodesBlock");
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
			<div className="tv">
				<div className="row">
					<div className="col-sm-3 col-md-2 col-lg-2">
						<button type="button" className="btn btn-primary" onClick={() => this.showComponent("seriesSearchBlock")}>
							Add
						</button>
						<br /><br />
						<li
							className="nav-link option"
							onClick={(e) => this.getSeasons(e.target.id)}
							key="0"
							id="all"
						>
							All
						</li>
						<Sidebar
							options={series}
							idField="seriesId"
							action={this.getSeasons}
						/>
					</div>
					<div className="col-sm-9 col-md-10 col-lg-10">
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
					</div>
				</div>
			</div>
		);
	}
}

export default TV;
