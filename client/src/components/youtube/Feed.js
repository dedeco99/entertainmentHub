import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";

import Zoom from "@material-ui/core/Zoom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { YoutubeContext } from "../../contexts/YoutubeContext";

import { getVideos } from "../../api/youtube";
import { deleteChannelGroup } from "../../api/channelGroups";

import ChannelGroupDetail from "./ChannelGroupDetail";

import { widget as widgetStyles } from "../../styles/Widgets";
import { feed as feedStyles } from "../../styles/Youtube";

const useStyles = makeStyles({ ...widgetStyles, ...feedStyles });

function Feed({ channelGroup }) {
	const classes = useStyles();
	const { dispatch } = useContext(YoutubeContext);
	const [videos, setVideos] = useState([]);
	const [open, setOpen] = useState(false);
	const [anchorOptionsMenu, setAnchorOptionsMenu] = useState(null);

	useEffect(() => {
		async function fetchData() {
			const response = await getVideos(channelGroup.channels.join(","));

			if (response.data && response.data.length) {
				setVideos(response.data);
				setOpen(true);
			}
		}

		fetchData();
	}, [channelGroup]);

	function openOptionsMenu(e) {
		setAnchorOptionsMenu(e.currentTarget);
	}

	function closeOptionsMenu() {
		setAnchorOptionsMenu(null);
	}

	async function deleteChannelGroupCall(channelGroupId) {
		const response = await deleteChannelGroup(channelGroupId);

		if (response.status === 200) {
			dispatch({ type: "DELETE_CHANNEL_GROUP", channelGroup: response.data });
		}
	}

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
						<IconButton onClick={openOptionsMenu}>
							<i className="material-icons">{"more_vert"}</i>
						</IconButton>
						<Menu
							anchorEl={anchorOptionsMenu}
							open={Boolean(anchorOptionsMenu)}
							keepMounted
							onClose={closeOptionsMenu}
						>
							<ChannelGroupDetail channelGroup={channelGroup} />
							<MenuItem onClick={() => deleteChannelGroupCall(channelGroup._id)}>
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
		</Zoom>
	);
}

Feed.propTypes = {
	channelGroup: PropTypes.object.isRequired,
};

export default Feed;
