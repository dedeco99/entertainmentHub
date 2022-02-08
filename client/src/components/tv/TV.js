import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles, Grid, Button } from "@material-ui/core";

import Subscriptions from "../.partials/Subscriptions";
import Episodes from "./Episodes";
import Series from "./Series";

import { translate } from "../../utils/translations";

import { tv as styles } from "../../styles/TV";

const useStyles = makeStyles(styles);

function TV() {
	const history = useHistory();
	const match = useRouteMatch();
	const classes = useStyles();
	const [blocks, setBlocks] = useState({
		openSeries: false,
		openEpisodes: false,
	});

	function handleShowSeriesBlock() {
		setBlocks({ openSeries: true, openEpisodes: false });
	}

	function handleShowEpisodesBlock() {
		setBlocks({ openSeries: false, openEpisodes: true });
	}

	function handleShowEpisodes(id) {
		if (match.params.seriesId !== id) {
			history.push(`/tv/${id}`);

			handleShowEpisodesBlock();
		}
	}

	function handleShowAll() {
		handleShowEpisodes("all");
	}

	function handleShowSeries() {
		history.push("/tv/series");

		handleShowSeriesBlock();
	}

	useEffect(() => {
		switch (match.path) {
			case "/tv":
				history.replace("tv/all");
				break;
			case "/tv/series":
				handleShowSeriesBlock();
				break;
			case "/tv/all":
			case "/tv/:seriesId":
			case "/tv/:seriesId/:season":
				handleShowEpisodesBlock();
				break;
			default:
				break;
		}
	}, [match.url]);

	function renderContent() {
		if (blocks.openSeries) {
			return <Series contentType="tv" bannerWidth={180} useWindowScroll />;
		} else if (blocks.openEpisodes) {
			return <Episodes />;
		}

		return <div />;
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={2} md={3} lg={2}>
				<Button
					onClick={handleShowAll}
					className={classes.outlinedBtn}
					color={blocks.openEpisodes ? "secondary" : "primary"}
					variant={blocks.openEpisodes ? "contained" : "outlined"}
					fullWidth
				>
					{"Feed"}
				</Button>
				<Button
					onClick={handleShowSeries}
					className={classes.outlinedBtn}
					color={blocks.openSeries ? "secondary" : "primary"}
					variant={blocks.openSeries ? "contained" : "outlined"}
					fullWidth
				>
					{translate("series")}
				</Button>
				<Subscriptions
					platform="tv"
					selected={match.params.seriesId}
					idField="externalId"
					countField="numToWatch"
					action={handleShowEpisodes}
				/>
			</Grid>
			<Grid item xs={12} sm={10} md={9} lg={10}>
				{renderContent()}
			</Grid>
		</Grid>
	);
}

export default TV;
