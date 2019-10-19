import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import reddit from "../../img/reddit.png";
import twitch from "../../img/twitch.png";
import youtube from "../../img/youtube.png";
import tv from "../../img/tv.png";

class Settings extends Component {
	constructor() {
		super();
		this.state = {
			apps: [
				{
					platform: "reddit",
					link: `https://www.reddit.com/api/v1/authorize
						?client_id=VXMNKvXfKALA3A
						&response_type=code
						&state=some_state
						&redirect_uri=http://localhost:5001/apps/reddit
						&duration=permanent
						&scope=read`,
				},
				{
					platform: "twitch",
					link: `https://api.twitch.tv/kraken/oauth2/authorize
						?client_id=9haxv452ih4k8ewiml53vqetrbm0z9q
						&response_type=code
						&redirect_uri=http://localhost:5001/apps/twitch
						&scope=user_read`,
				},
				{
					platform: "youtube",
					link: `https://accounts.google.com/o/oauth2/v2/auth
						?redirect_uri=http://localhost:5001/apps/google
						&prompt=consent
						&access_type=offline
						&response_type=code
						&client_id=769835198677-vn6mkg9odjt6p08a2ph0jslssdgbtnaj.apps.googleusercontent.com
						&scope=https://www.googleapis.com/auth/youtube.readonly`,
				},
				{
					platform: "tv",
					link: "/apps/tv",
				},
			],

			selectedMenu: 0,
		};
	}

	render() {
		const { apps, selectedMenu } = this.state;

		return (
			<Grid container spacing={2}>
				<Grid item xs={12} sm={4} md={3} lg={2}>
					<List className="list-menu">
						<ListItem
							button
							selected={selectedMenu === 0}
							onClick={() => this.setState({ selectedMenu: 0 })}
						>
							<ListItemIcon>
								<i className="material-icons" style={{ color: "white", fontSize: "2em" }}>apps</i>
							</ListItemIcon>
							<ListItemText primary="Apps" />
						</ListItem>
					</List>
				</Grid>
				<Grid item xs={12} sm={8} md={9} lg={10}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
							<div className="choicecontainer">
								<a href={apps.find(app => app.platform === "reddit").link} target="_self">
									<img src={reddit} width="100%" alt="Reddit" />
								</a>
							</div>
						</Grid>
						<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
							<div className="choicecontainer">
								<a href={apps.find(app => app.platform === "twitch").link}>
									<img src={twitch} width="100%" alt="Twitch" />
								</a>
							</div>
						</Grid>
						<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
							<div className="choicecontainer">
								<a href={apps.find(app => app.platform === "youtube").link}>
									<img src={youtube} width="100%" alt="Youtube" />
								</a>
							</div>
						</Grid>
						<Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
							<div className="choicecontainer">
								<a href={apps.find(app => app.platform === "tv").link}>
									<img src={tv} width="100%" alt="TV" />
								</a>
							</div>
						</Grid>
					</Grid>
				</Grid>
			</Grid >
		);
	}
}

export default Settings;
