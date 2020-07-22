import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

import Zoom from "@material-ui/core/Zoom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { YoutubeContext } from "../../contexts/YoutubeContext";

import { getVideos } from "../../api/youtube";
import { deleteChannelGroup } from "../../api/channelGroups";

import { widget as widgetStyles } from "../../styles/Widgets";
import { feed as feedStyles } from "../../styles/Youtube";

const styles = { ...widgetStyles, ...feedStyles };

class Feed extends Component {
	constructor() {
		super();

		this.state = {
			videos: [],

			open: false,
			anchorOptionsMenu: null,
		};

		this.openOptionsMenu = this.openOptionsMenu.bind(this);
		this.closeOptionsMenu = this.closeOptionsMenu.bind(this);

		this.deleteChannelGroup = this.deleteChannelGroup.bind(this);
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

	openOptionsMenu(e) {
		this.setState({ anchorOptionsMenu: e.currentTarget });
	}

	closeOptionsMenu() {
		this.setState({ anchorOptionsMenu: null });
	}

	async deleteChannelGroup(channelGroupId) {
		const { dispatch } = this.context;

		const response = await deleteChannelGroup(channelGroupId);

		if (response.status === 200) {
			dispatch({ type: "DELETE_CHANNEL_GROUP", channelGroup: response.data });
		}
	}

	render() {
		const { classes, channelGroup } = this.props;
		const { videos, open, anchorOptionsMenu } = this.state;

		return (
			<Zoom in={open}>
				<Box display="flex" flexDirection="column" className={classes.root}>
					<Box display="flex" alignItems="center" className={classes.header}>
						<Box display="flex" flexGrow={1}>
							<Typography variant="subtitle1">
								{channelGroup.displayName}
							</Typography>
						</Box>
						<Box display="flex" justifyContent="flex-end">
							<IconButton onClick={e => this.openOptionsMenu(e)}>
								<i className="material-icons">{"more_vert"}</i>
							</IconButton>
							<Menu
								anchorEl={anchorOptionsMenu}
								open={Boolean(anchorOptionsMenu)}
								keepMounted
								onClose={this.closeOptionsMenu}
							>
								<MenuItem>
									{"Edit"}
								</MenuItem>
								<MenuItem onClick={() => this.deleteChannelGroup(channelGroup._id)}>
									{"Delete"}
								</MenuItem>
							</Menu>
						</Box>
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

Feed.contextType = YoutubeContext;

Feed.propTypes = {
	classes: PropTypes.object.isRequired,
	channelGroup: PropTypes.object.isRequired,
};

export default withStyles(styles)(Feed);
