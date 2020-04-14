import React, { Component } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import InfiniteScroll from "react-infinite-scroller";

import loadingGif from "../../img/loading3.gif";
import placeholder from "../../img/noimage.png";

class Banners extends Component {
	constructor() {
		super();
		this.state = {
			loadingAddSeries: false,
		};

		this.renderAddIcon = this.renderAddIcon.bind(this);
		this.addSeries = this.addSeries.bind(this);
	}

	async addSeries(e) {
		const { series, addSeries } = this.props;

		this.setState({ loadingAddSeries: true });

		const seriesToAdd = series.find(s => s.id.toString() === e.target.id);

		await addSeries(seriesToAdd);

		this.setState({ loadingAddSeries: false });
	}

	renderAddIcon(s) {
		const { allSeries } = this.props;
		const { loadingAddSeries } = this.state;

		const seriesIds = allSeries.map(us => us.seriesId);

		if (loadingAddSeries) {
			return (
				<span className="add-series-icon">
					<img src={loadingGif} height="48px" alt="Loading..." />
				</span>
			);
		} else if (!seriesIds.includes(s.id.toString())) {
			return (
				<i
					id={s.id}
					className="add-series-icon icofont-ui-add icofont-3x"
					onClick={this.addSeries}
				/>
			);
		}

		return null;
	}

	renderSeriesBlock(series) {
		if (!series || !series.length) return <div />;

		return (
			<Grid container spacing={2}>
				{
					series.map(s => (
						<Grid
							item xs={6} sm={4} md={3} lg={2} xl={1}
							key={s.id}
						>
							<div className="add-series-container">
								{this.renderAddIcon(s)}
								<img
									src={s.image.substr(s.image.length - 4) === "null" ? placeholder : s.image}
									width="100%"
									alt={s.displayName}
								/>
							</div>
						</Grid>
					))
				}
			</Grid>
		);
	}

	render() {
		const { series, getMore, hasMore } = this.props;

		return (
			<InfiniteScroll
				pageStart={0}
				loadMore={getMore}
				hasMore={hasMore}
			>
				{this.renderSeriesBlock(series)}
			</InfiniteScroll>
		);
	}
}

Banners.propTypes = {
	series: PropTypes.array.isRequired,
	getMore: PropTypes.func.isRequired,
	hasMore: PropTypes.bool.isRequired,
	allSeries: PropTypes.array.isRequired,
	addSeries: PropTypes.func.isRequired,
};

export default Banners;
