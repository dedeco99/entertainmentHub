import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

import { makeStyles, List, ListItem, Typography } from "@material-ui/core";

import Banners from "./Banners";
import Loading from "../.partials/Loading";

import { TVContext } from "../../contexts/TVContext";

import { getPopular } from "../../api/tv";

import { tv as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function Popular({ type, bannerWidth, useWindowScroll, listView }) {
	const classes = useStyles();
	const { state, dispatch } = useContext(TVContext);
	const { follows } = state;
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [lastType, setLastType] = useState(type);
	let isMounted = true;

	async function handleGetPopular() {
		if (!loading) {
			setLoading(true);

			let nextPage = page;

			if (lastType !== type) nextPage = 0;

			const response = await getPopular(nextPage, "imdb", type);

			if (response.status === 200 && isMounted) {
				const newPopular = nextPage === 0 ? response.data : follows.concat(response.data);

				dispatch({ type: "SET_FOLLOWS", follows: newPopular });

				setPage(nextPage + 1);
				setHasMore(!(response.data.length < 20));
				setLoading(false);
				setOpen(true);
			}
		}
	}

	useEffect(() => {
		async function fetchData() {
			setLastType(type);
			await handleGetPopular();
		}

		fetchData();

		return () => (isMounted = false);
	}, [type]);

	if (!open) return <Loading />;

	return listView ? (
		<InfiniteScroll
			pageStart={0}
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
			hasActions
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
