import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

import { makeStyles, List, ListItem, Typography } from "@material-ui/core";

import Banners from "./Banners";
import Loading from "../.partials/Loading";

import { getPopular } from "../../api/tv";

import { tv as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function Popular({ type, bannerWidth, useWindowScroll, listView }) {
	const classes = useStyles();
	const [follows, setFollows] = useState([]);
	const [hasMore, setHasMore] = useState(false);
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(false);

	async function handleGetPopular() {
		if (!loading) {
			setLoading(true);

			const response = await getPopular(page, "imdb", type);

			if (response.status === 200) {
				setPage(prev => prev + 1);
				setFollows(prev => [...prev, ...response.data]);
				setHasMore(!(response.data.length < 20));
				setLoading(false);
			}
		}
	}

	useEffect(() => {
		setPage(0);
		setFollows([]);
		setHasMore(true);
	}, [type]);

	return listView ? (
		<InfiniteScroll
			loadMore={handleGetPopular}
			hasMore={hasMore}
			loader={<Loading key={0} />}
			useWindow={useWindowScroll}
		>
			<List>
				{follows.map(serie => (
					<ListItem key={serie.externalId} button divider>
						<img src={serie.image} height="100x" alt="Series" />
						<Typography variant="body1" className={classes.popularText}>
							{serie.displayName}
						</Typography>
					</ListItem>
				))}
			</List>
		</InfiniteScroll>
	) : (
		<Banners
			series={follows}
			getMore={handleGetPopular}
			hasMore={hasMore}
			type={type}
			bannerWidth={bannerWidth}
			useWindowScroll={useWindowScroll}
		/>
	);
}

Popular.propTypes = {
	type: PropTypes.string.isRequired,
	bannerWidth: PropTypes.number.isRequired,
	useWindowScroll: PropTypes.bool.isRequired,
	listView: PropTypes.bool,
};

export default Popular;
