import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/styles";
import Zoom from "@material-ui/core/Zoom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import ListItem from "@material-ui/core/ListItem";

import Widget from "../widgets/Widget";
import ChannelGroupDetail from "./ChannelGroupDetail";

import { YoutubeContext } from "../../contexts/YoutubeContext";

import { getVideos } from "../../api/youtube";
import { deleteChannelGroup } from "../../api/channelGroups";

import { widget as widgetStyles } from "../../styles/Widgets";
import { feed as feedStyles } from "../../styles/Youtube";
import { formatDate, formatVideoDuration } from "../../utils/utils";

const useStyles = makeStyles({ ...widgetStyles, ...feedStyles });

function Feed({ channelGroup }) {
	const classes = useStyles();
	const { dispatch } = useContext(YoutubeContext);
	const [videos, setVideos] = useState([]);
	const [open, setOpen] = useState(false);
	const [openModal, setOpenModal] = useState(false);

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

	async function handleDeleteChannelGroup() {
		const response = await deleteChannelGroup(channelGroup._id);

		if (response.status === 200) {
			dispatch({ type: "DELETE_CHANNEL_GROUP", channelGroup: response.data });
		}
	}

	function handleOpenModal() {
		setOpenModal(true);
	}

	function handleCloseModal() {
		setOpenModal(false);
	}

	function renderVideos() {
		return videos.map(video => (
			<ListItem key={video.videoId} divider style={{ padding: 0, margin: 0 }}>
				<Box display="flex" flexDirection="column" flex="auto" minWidth={0}>
					<Box position="relative">
						<img src={video.thumbnail} width="100%" alt="Video thumbnail" />
						<Box position="absolute" bottom="0" right="0" px={0.5} style={{ backgroundColor: "#212121DD" }}>
							<Typography variant="caption">{formatVideoDuration(video.duration)}</Typography>
						</Box>
					</Box>
					<Box style={{ paddingLeft: 5, paddingRight: 10 }}>
						<Typography className={classes.videoTitle} variant="body1" title={video.videoTitle}>
							<Link
								href={`https://www.youtube.com/watch?v=${video.videoId}`}
								target="_blank"
								rel="noreferrer"
								color="inherit"
							>
								{video.videoTitle}
							</Link>
						</Typography>
						<Typography variant="body2" title={video.displayName}>
							<Link
								href={`https://www.youtube.com/channel/${video.channelId}`}
								target="_blank"
								rel="noreferrer"
								color="inherit"
							>
								{video.displayName}
							</Link>
						</Typography>
						<Typography variant="caption">
							{`${formatDate(video.published, "DD-MM-YYYY HH:mm", true)} • ${video.views} views`}
						</Typography>
						<Box display="flex" flexDirection="row" flex="1 1 auto" minWidth={0}>
							<Typography variant="caption" style={{ paddingRight: "10px" }}>
								<i className="icofont-thumbs-up" />
								{` ${video.likes}`}
							</Typography>
							<Typography variant="caption">
								<i className="icofont-thumbs-down" />
								{` ${video.dislikes}`}
							</Typography>
						</Box>
					</Box>
				</Box>
			</ListItem>
		));
	}

	function renderFeed() {
		return (
			<Zoom in={open}>
				<Box display="flex" flexDirection="column" className={classes.root}>
					<Box display="flex" alignItems="center" className={classes.header}>
						<Typography variant="subtitle1">{channelGroup.displayName}</Typography>
					</Box>
					<Box
						display="flex"
						flexWrap="wrap"
						justifyContent="center"
						height="100%"
						style={{ overflow: "auto", width: "inherit" }}
					>
						{renderVideos()}
					</Box>
				</Box>
			</Zoom>
		);
	}

	return (
		<>
			<Widget
				id={channelGroup._id}
				type={"youtube"}
				content={renderFeed()}
				editText={"Youtube"}
				editIcon={"icofont-youtube-play"}
				onEdit={handleOpenModal}
				onDelete={handleDeleteChannelGroup}
			/>
			<ChannelGroupDetail open={openModal} channelGroup={channelGroup} onClose={handleCloseModal} />
		</>
	);
}

Feed.propTypes = {
	channelGroup: PropTypes.object.isRequired,
};

export default Feed;
