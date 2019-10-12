import React, { Component } from "react";

import { getSeasons, getEpisodes } from "../../actions/tv";

import Sidebar from "../.partials/Sidebar";
import Categories from "../.partials/Categories";
import Episodes from "./Episodes";
import Search from "./Search";

import "../../css/TV.css";

class TV extends Component {
	state = {
		series: [],
		seasons: [],
		episodes: [],
	};

	getSeasons = async (series) => {
		const response = await getSeasons("62560");
		console.log(response);
		this.setState({ seasons: response.data });

		this.showComponent("episodesBlock");
	}

	getEpisodes = (series, season) => {
		getEpisodes(series, season);
		this.showComponent("episodesBlock");
	}

	showComponent = (component) => {
		const components = ["episodesBlock", "seriesSearchBlock"];

		components.forEach(component => {
			document.getElementById(component).style.display = "none";
		})

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
