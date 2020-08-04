import React, { useContext, useState } from "react";

import { InputAdornment } from "@material-ui/core";

import Input from "../.partials/Input";
import Loading from "../.partials/Loading";
import Banners from "./Banners";

import { TVContext } from "../../contexts/TVContext";

import { getSearch } from "../../api/tv";

function Search() {
	const { state, dispatch } = useContext(TVContext);
	const { follows } = state;
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleGetSearch() {
		if (!loading) {
			setLoading(true);

			const response = await getSearch(query, page);

			const newSearch = page === 0 ? response.data : follows.concat(response.data);

			dispatch({ type: "SET_FOLLOWS", follows: newSearch });

			setPage(page + 1);
			setHasMore(!(response.data.length < 20));
			setLoading(false);
		}
	}

	function handleSearch(e) {
		setQuery(e.target.value);
		setPage(0);
	}

	function handleSubmit(e) {
		e.preventDefault();

		handleGetSearch();
	}

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<Input
					id="search"
					label="Search"
					value={query}
					onChange={handleSearch}
					InputProps={{
						endAdornment: <InputAdornment position="end">{loading && <Loading />}</InputAdornment>,
					}}
					margin="normal"
					variant="outlined"
					fullWidth
				/>
			</form>
			<Banners series={follows} getMore={handleGetSearch} hasMore={hasMore} />
		</div>
	);
}

export default Search;
