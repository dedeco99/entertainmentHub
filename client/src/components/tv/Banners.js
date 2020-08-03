import React, { useState } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

import { makeStyles, Grid } from "@material-ui/core";

import Loading from "../.partials/Loading";

import { banners as styles } from "../../styles/TV";

import placeholder from "../../img/noimage.png";

const useStyles = makeStyles(styles);

function Banners({ series, getMore, hasMore, allSeries, addSeries }) {
	const classes = useStyles();
	const [loadingAddSeries, setLoadingAddSeries] = useState(false);

	async function handleAddSeries(e) {
		setLoadingAddSeries(true);

		const seriesToAdd = series.find(s => s.id.toString() === e.target.id);

		await addSeries(seriesToAdd);

		setLoadingAddSeries(false);
	}

	function renderAddIcon(s) {
		const seriesIds = allSeries.map(us => us.seriesId);

		if (loadingAddSeries) {
			return (
				<span className={classes.addSeriesIcon}>
					<Loading />
				</span>
			);
		} else if (!seriesIds.includes(s.id.toString())) {
			return (
				<i id={s.id} className={`${classes.addSeriesIcon} icofont-ui-add icofont-3x`} onClick={handleAddSeries} />
			);
		}

		return null;
	}

	function renderSeriesBlock() {
		if (!series || !series.length) return <div />;

		return (
			<Grid container spacing={2}>
				{series.map(s => (
					<Grid item xs={6} sm={4} md={3} lg={2} xl={1} key={s.id}>
						<div className={classes.addSeriesContainer}>
							{renderAddIcon(s)}
							<img
								src={s.image.substr(s.image.length - 4) === "null" ? placeholder : s.image}
								width="100%"
								alt={s.displayName}
							/>
						</div>
					</Grid>
				))}
			</Grid>
		);
	}

	return (
		<InfiniteScroll pageStart={0} loadMore={getMore} hasMore={hasMore}>
			{renderSeriesBlock()}
		</InfiniteScroll>
	);
}

Banners.propTypes = {
	series: PropTypes.array.isRequired,
	getMore: PropTypes.func.isRequired,
	hasMore: PropTypes.bool.isRequired,
	allSeries: PropTypes.array.isRequired,
	addSeries: PropTypes.func.isRequired,
};

export default Banners;
