import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import { getApps } from "../../actions/auth";

class AppMenu extends Component {
	constructor() {
		super();
		this.state = {
			apps: [],

			selectedMenu: 0,
		};

		this.getApps = this.getApps.bind(this);
		this.getAppList = this.getAppList.bind(this);
		this.handleAppClick = this.handleAppClick.bind(this);
	}

	componentDidMount() {
		this.getApps();
	}

	async getApps() {
		const apps = [
			{ platform: "reddit", name: "Reddit", icon: "icofont-reddit icofont-2x", endpoint: "/reddit" },
			{ platform: "youtube", name: "Youtube", icon: "icofont-youtube-play icofont-2x", endpoint: "/youtube" },
			{ platform: "twitch", name: "Twitch", icon: "icofont-twitch icofont-2x", endpoint: "/twitch" },
			{ platform: "tv", name: "TV Series", icon: "icofont-monitor icofont-2x", endpoint: "/tv" },
		];
		const redirected = localStorage.getItem("redirected");

		const response = await getApps();

		if (response.data && response.data.length) {
			const userApps = apps.filter(app => {
				return response.data.find(appR => appR.platform === app.platform);
			});

			this.setState({ apps: userApps });
		} else if (!redirected) {
			localStorage.setItem("redirected", true);
			window.location.replace("/settings");
		}
	}

	handleAppClick(e) {
		this.setState({ selectedMenu: e.target.id });
	}

	getAppList() {
		const { apps, selectedMenu } = this.state;

		return apps.map(app => (
			<ListItem
				button
				id={app.platform}
				key={app.platform}
				selected={selectedMenu === app.platform}
				onClick={this.handleAppClick}
				style={{ paddingLeft: 10 }}
			>
				<NavLink className="nav-item" to={app.endpoint}>
					<i className={app.icon} />
				</NavLink>
			</ListItem >
		));
	}

	render() {
		const user = localStorage.getItem("user");
		const token = localStorage.getItem("token");

		if (user && token) {
			return (
				<div className="appMenu">
					<List className="list-menu" >
						{this.getAppList()}
					</List>
				</div>
			);
		}

		return <div />;
	}
}

export default AppMenu;
