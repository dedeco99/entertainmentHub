import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/styles";
import Zoom from "@material-ui/core/Zoom";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import Widget from "../widgets/Widget";
import ChannelGroupDetail from "./ChannelGroupDetail";

import { YoutubeContext } from "../../contexts/YoutubeContext";

import { getVideos } from "../../api/youtube";
import { deleteChannelGroup } from "../../api/channelGroups";

import { widget as widgetStyles } from "../../styles/Widgets";
import { feed as feedStyles } from "../../styles/Youtube";

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
						style={{ overflow: "auto", padding: 10 }}
					>
						{videos.map(video => (
							<div key={video.videoId}>
								{video.videoTitle}
								<br />
								{video.displayName}
								<br />
								{video.published}
								<br />
								<br />
							</div>
						))}
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
