import React, { useState, useContext, useEffect } from "react";

import Banners from "./Banners";
import Loading from "../.partials/Loading";

import { TVContext } from "../../contexts/TVContext";

import { getPopular } from "../../api/tv";

function Popular() {
	const { state, dispatch } = useContext(TVContext);
	const { follows } = state;
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	async function handleGetPopular() {
		if (!loading) {
			setLoading(true);

			const response = await getPopular(page);

			const newPopular = page === 0 ? response.data : follows.concat(response.data);

			dispatch({ type: "SET_FOLLOWS", follows: newPopular });

			setPage(page + 1);
			setHasMore(!(response.data.length < 20));
			setLoading(false);
			setOpen(true);
		}
	}

	useEffect(() => {
		handleGetPopular();
	}, []); // eslint-disable-line

	if (!open) return <Loading />;

	return <Banners series={follows} getMore={handleGetPopular} hasMore={hasMore} />;
}

export default Popular;
