import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

import Zoom from "@material-ui/core/Zoom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import { getVideos } from "../../api/youtube";

import { widget as widgetStyles } from "../../styles/Widgets";
import { feed as feedStyles } from "../../styles/Youtube";

const styles = { ...widgetStyles, ...feedStyles };

class Feed extends Component {
	constructor() {
		super();

		this.state = {
			videos: [],

			open: false,
		};
	}

	componentDidMount() {
		this.getVideos();
	}

	async getVideos() {
		const { channelGroup } = this.props;

		const response = await getVideos(channelGroup.channels.join(","));

		if (response.data && response.data.length) {
			this.setState({ videos: response.data, open: true });
		}
	}

	render() {
		const { classes, channelGroup } = this.props;
		const { videos, open } = this.state;

		return (
			<Zoom in={open}>
				<Box display="flex" flexDirection="column" className={classes.root}>
					<Box display="flex" flexGrow={1} className={classes.header}>
						<Typography variant="subtitle1">
							{channelGroup.displayName}
						</Typography>
					</Box>
					<Box
						display="flex"
						flexWrap="wrap"
						justifyContent="center"
						height="100%"
						style={{ overflow: "auto", padding: 10 }}
					>
						{videos.map(video => (
							<div key={video.videoId}>
								{video.videoTitle}<br />
								{video.displayName}<br />
								{video.published}<br />
								<br />
							</div>
						))}
					</Box>
				</Box>
			</Zoom >
		);
	}
}

Feed.propTypes = {
	classes: PropTypes.object.isRequired,
	channelGroup: PropTypes.object.isRequired,
};

export default withStyles(styles)(Feed);
