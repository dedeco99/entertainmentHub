import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

class AppMenu extends Component {
	constructor() {
		super();
		this.state = {
			selectedMenu: 0,
		};
	}

	getAppList() {
		const apps = [
			{ id: 0, name: "Reddit", icon: "icofont-reddit icofont-2x", endpoint: "/reddit" },
			{ id: 1, name: "Youtube", icon: "icofont-youtube-play icofont-2x", endpoint: "/youtube" },
			{ id: 2, name: "Twitch", icon: "icofont-twitch icofont-2x", endpoint: "/twitch" },
			{ id: 3, name: "TV Series", icon: "icofont-monitor icofont-2x", endpoint: "/tv" },
		];

		return apps.map(app => {
			return (
				<ListItem
					button
					selected={this.state.selectedMenu === app.id}
					onClick={() => this.setState({ selectedMenu: app.id })}
					key={app.id}
					style={{ paddingLeft: 10 }}
				>
					<NavLink className="nav-item" to={app.endpoint}>
						<i className={app.icon}></i>
					</NavLink>
				</ListItem >
			);
		});
	}

	render() {
		return (
			<div className="appMenu">
				<List className="list-menu" >
					{this.getAppList()}
				</List>
			</div>
		);
	}
}

export default AppMenu;
