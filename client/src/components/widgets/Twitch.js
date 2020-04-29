import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

import Zoom from "@material-ui/core/Zoom";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { getStreams } from "../../api/twitch";

import { reddit as styles } from "../../styles/Widgets";

class Twitch extends Component {
	constructor() {
		super();
		this.state = {
			streams: [],

			open: false,
		};
	}

	async componentDidMount() {
		await this.getStreams();
	}

	async getStreams() {
		const response = await getStreams();

		console.log(response);

		this.setState({ streams: response.data, open: true });
	}

	renderStreamsList() {
		const { streams } = this.state;

		const streamsList = streams.map(stream => (
			<ListItem key={stream.id} button divider>
				<ListItemText
					primary={stream.title}
					title={stream.title}
					secondary={stream.user}
					primaryTypographyProps={{ noWrap: true }}
				/>
			</ListItem >
		));

		return <List>{streamsList}</List>;
	}

	render() {
		const { classes } = this.props;
		const { open } = this.state;

		return (
			<Zoom in={open}>
				<Card
					variant="outlined"
					className={classes.root}
				>
					{this.renderStreamsList()}
				</Card>
			</Zoom>
		);
	}
}

Twitch.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Twitch);
