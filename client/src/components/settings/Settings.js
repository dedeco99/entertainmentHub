import React, { Component } from 'react';

import Sidebar from "../.partials/Sidebar";

import reddit from "../../img/reddit.png";
import twitch from "../../img/twitch.png";
import youtube from "../../img/youtube.png";
import tv from "../../img/tv.png";

class Settings extends Component {
	state = {
		apps: [
			{
				platform: "reddit",
				link: `https://www.reddit.com/api/v1/authorize
					?client_id=VXMNKvXfKALA3A
					&response_type=code
					&state=some_state
					&redirect_uri=http://localhost:5001/apps/reddit
					&duration=permanent
					&scope=read`
			},
			{
				platform: "twitch",
				link: `https://api.twitch.tv/kraken/oauth2/authorize
					?client_id=9haxv452ih4k8ewiml53vqetrbm0z9q
					&response_type=code
					&redirect_uri=http://localhost:5001/apps/twitch
					&scope=user_read`
			},
			{
				platform: "youtube",
				link: `https://accounts.google.com/o/oauth2/v2/auth
					?redirect_uri=http://localhost:5001/apps/google
					&prompt=consent
					&access_type=offline
					&response_type=code
					&client_id=769835198677-vn6mkg9odjt6p08a2ph0jslssdgbtnaj.apps.googleusercontent.com
					&scope=https://www.googleapis.com/auth/youtube.readonly`
			}
		],
	};

	showComponent = (component) => {
		const components = ["appsBlock"];

		components.forEach(component => {
			document.getElementById(component).style.display = "none";
		})

		document.getElementById(component).style.display = "block";
	}

	render() {
		let options = [{ id: "apps", displayName: "Apps" }];
		const { apps } = this.state;

		return (
			<div className="settings">
				<div className="row">
					<div className="col-sm-3 col-md-2 col-lg-2">
						<Sidebar
							options={options}
							idField="id"
							action={this.showComponent}
						/>
					</div>
					<div className="col-sm-9 col-md-10 col-lg-10">
						<div id="settingscontent">
							<div className="row" id="settingsapps">
								<div className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div className="choicecontainer">
										<a href={apps.find(app => app.platform === "reddit").link} target="_self">
											<img src={reddit} width="100%" alt="Reddit" />
										</a>
									</div>
								</div>
								<div className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div className="choicecontainer">
										<a href={apps.find(app => app.platform === "twitch").link}>
											<img src={twitch} width="100%" alt="Twitch" />
										</a>
									</div>
								</div>
								<div className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div className="choicecontainer">
										<a href={apps.find(app => app.platform === "youtube").link}>
											<img src={youtube} width="100%" alt="Youtube" />
										</a>
									</div>
								</div>
								<div className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
									<div className="choicecontainer">
										<img src={tv} width="100%" alt="TV" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Settings;
