import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

import Zoom from "@material-ui/core/Zoom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Box from "@material-ui/core/Box";

import { getStreams } from "../../api/twitch";

import { twitch as styles } from "../../styles/Widgets";
import { Typography } from "@material-ui/core";

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
		const { history } = this.props;

		const response = await getStreams();

		if (response.status === 401) return history.push("/settings");

		this.setState({ streams: response.data, open: true });

		return null;
	}

	renderStreamsList() {
		const { classes } = this.props;
		const { streams } = this.state;

		const streamsList = streams.map(stream => (
			<ListItem key={stream.id} button divider>
				<Box flex="1" flexGrow={1} className={classes.imageWrapper}>
					<img alt={`${stream.user}-preview`} src={stream.thumbnail} width="100%" />
					<Typography variant="caption" className={classes.viewers}> {stream.viewers} </Typography>
				</Box>
				<Box p={1} flex="1" flexGrow={2} minWidth="0%">
					<Typography variant="body1" noWrap> {stream.user} </Typography>
					<Typography variant="body2" noWrap> {stream.title} </Typography>
					<Typography variant="subtitle2" noWrap> {stream.game} </Typography>
				</Box>
			</ListItem >
		));

		return <List>{streamsList}</List>;
	}

	render() {
		const { classes } = this.props;
		const { open } = this.state;

		return (
			<Zoom in={open}>
				<Box className={classes.root}>
					{this.renderStreamsList()}
				</Box>
			</Zoom>
		);
	}
}

Twitch.propTypes = {
	history: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Twitch);
