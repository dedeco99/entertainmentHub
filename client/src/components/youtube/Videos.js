import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";
import { useRouteMatch } from "react-router-dom";

import { makeStyles, Grid, Card } from "@material-ui/core";

import Loading from "../.partials/Loading";
import Video from "./Video";

import { getVideos } from "../../api/youtube";
import { getClips } from "../../api/twitch";

import { videos as styles } from "../../styles/Youtube";

const useStyles = makeStyles(styles);

function Videos({ platform }) {
	const match = useRouteMatch();
	const classes = useStyles();
	const [videos, setVideos] = useState([]);
	const [pagination, setPagination] = useState({
		page: 0,
		hasMore: false,
		after: null,
	});
	const [callApi, setCallApi] = useState(true);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	async function handleGetVideos() {
		if (!loading) {
			setLoading(true);

			if (pagination.page === 0) setOpen(false);

			const response =
				platform === "youtube" ? await getVideos(match.params.channel) : await getClips(match.params.channel);

			if (response.status === 200) {
				const newVideos = pagination.page === 0 ? response.data : videos.concat(response.data);

				setVideos(newVideos);

				setPagination({
					page: pagination.page + 1,
					hasMore: !(response.data.length < 25),
					after: response.data.length ? response.data[response.data.length - 1].after : null,
				});
				setLoading(false);
				if (pagination.page === 0) setOpen(true);
			}
		}
	}

	useEffect(() => {
		setPagination({ page: 0, hasMore: false, after: null });
		setCallApi(!callApi);
	}, [match.url]);

	useEffect(() => {
		async function fetchData() {
			await handleGetVideos();
		}

		fetchData();
	}, [callApi]);

	function renderVideos() {
		return videos.map(video => (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={video.videoId}>
				<Card variant="outlined" className={classes.root}>
					<Video platform={platform} video={video} />
				</Card>
			</Grid>
		));
	}

	function renderAllVideos() {
		return (
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<InfiniteScroll loadMore={handleGetVideos} hasMore={pagination.hasMore} loader={<Loading key={0} />}>
						<Grid container spacing={2}>
							{renderVideos()}
						</Grid>
					</InfiniteScroll>
				</Grid>
			</Grid>
		);
	}

	if (!open) return <Loading />;

	return renderAllVideos();
}

Videos.propTypes = {
	platform: PropTypes.string.isRequired,
};

export default Videos;
