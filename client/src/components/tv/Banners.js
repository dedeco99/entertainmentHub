import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";

import { makeStyles, Grid } from "@material-ui/core";

import Loading from "../.partials/Loading";

import { TVContext } from "../../contexts/TVContext";

import { addSubscriptions } from "../../api/subscriptions";

import { banners as styles } from "../../styles/TV";

import placeholder from "../../img/noimage.png";

const useStyles = makeStyles(styles);

function Banners({ series, getMore, hasMore }) {
	const classes = useStyles();
	const { state, dispatch } = useContext(TVContext);
	const { subscriptions } = state;
	const [loading, setLoading] = useState(false);

	async function handleAddSeries(e) {
		setLoading(true);

		const seriesToAdd = series.find(s => s.externalId.toString() === e.target.id);

		const response = await addSubscriptions("tv", [seriesToAdd]);

		if (response.status === 201) {
			dispatch({ type: "ADD_SUBSCRIPTION", subscription: response.data });
		}

		setLoading(false);
	}

	function renderAddIcon(s) {
		const seriesIds = subscriptions.map(us => us.externalId);

		if (loading) {
			return (
				<span className={classes.addSeriesIcon}>
					<Loading />
				</span>
			);
		} else if (!seriesIds.includes(s.externalId.toString())) {
			return (
				<i
					id={s.externalId}
					className={`${classes.addSeriesIcon} icofont-ui-add icofont-3x`}
					onClick={handleAddSeries}
				/>
			);
		}

		return null;
	}

	function renderSeriesBlock() {
		if (!series || !series.length) return <div />;

		return (
			<Grid container spacing={2}>
				{series.map(s => (
					<Grid item xs={6} sm={4} md={3} lg={2} xl={1} key={s.externalId}>
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
};

export default Banners;
