import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";

import Banners from "./Banners";
import Loading from "../.partials/Loading";

import { TVContext } from "../../contexts/TVContext";

import { getPopular } from "../../api/tv";

function Popular({ type, bannerWidth }) {
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
			await handleGetPopular();
		}

		fetchData();

		return () => (isMounted = false); // eslint-disable-line
	}, []); // eslint-disable-line

	useEffect(() => {
		async function fetchData() {
			setLastType(type);
			await handleGetPopular();
		}

		fetchData();

		return () => (isMounted = false); // eslint-disable-line
	}, [type]);

	if (!open) return <Loading />;

	return (
		<Banners series={follows} getMore={handleGetPopular} hasMore={hasMore} hasActions bannerWidth={bannerWidth} />
	);
}

Popular.propTypes = {
	type: PropTypes.string.isRequired,
	bannerWidth: PropTypes.number.isRequired,
};

export default Popular;
