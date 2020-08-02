import React, { useState } from "react";
import PropTypes from "prop-types";

import { InputAdornment } from "@material-ui/core";

import Input from "../.partials/Input";
import Loading from "../.partials/Loading";
import Banners from "./Banners";

import { getSearch } from "../../api/tv";

function Search({ allSeries, addSeries }) {
	const [search, setSearch] = useState([]);
	const [query, setQuery] = useState("");
	const [page, setPage] = useState(0);
	const [hasMore, setHasMore] = useState(false);
	const [loading, setLoading] = useState(false);

	async function handleGetSearch() {
		if (!loading) {
			setLoading(true);

			const response = await getSearch(query, page);

			const newSearch = page === 0 ? response.data : search.concat(response.data);

			setSearch(newSearch);
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
			<Banners
				series={search}
				getMore={handleGetSearch}
				hasMore={hasMore}
				allSeries={allSeries}
				addSeries={addSeries}
			/>
		</div>
	);
}

Search.propTypes = {
	allSeries: PropTypes.array.isRequired,
	addSeries: PropTypes.func.isRequired,
};

export default Search;
