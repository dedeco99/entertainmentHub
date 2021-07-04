import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles, Grid, Fab, Button } from "@material-ui/core";

import Subscriptions from "../.partials/Subscriptions";
import Episodes from "./Episodes";
import Search from "./Search";
import Popular from "./Popular";

import { translate } from "../../utils/translations";

import { tv as styles } from "../../styles/TV";

const useStyles = makeStyles(styles);

function TV() {
	const history = useHistory();
	const match = useRouteMatch();
	const classes = useStyles();
	const [blocks, setBlocks] = useState({
		openSearch: false,
		openPopular: false,
		openEpisodes: true,
	});

	function handleShowSearchBlock() {
		setBlocks({ openSearch: true, openPopular: false, openEpisodes: false });
	}

	function handleShowPopularBlock() {
		setBlocks({ openSearch: false, openPopular: true, openEpisodes: false });
	}

	function handleShowEpisodesBlock() {
		setBlocks({ openSearch: false, openPopular: false, openEpisodes: true });
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

	function handleShowPopular() {
		history.push("/tv/popular");

		handleShowPopularBlock();
	}

	useEffect(() => {
		switch (match.path) {
			case "/tv":
				history.replace("tv/all");
				break;
			case "/tv/popular":
				handleShowPopularBlock();
				break;
			case "/tv/all":
			case "/tv/:seriesId":
			case "/tv/:seriesId/:season":
				handleShowEpisodesBlock();
				break;
			default:
				break;
		}
	}, [match.url]); // eslint-disable-line

	function renderButtons() {
		return (
			<div align="center">
				<Fab onClick={handleShowSearchBlock} variant="extended" size="medium" className={classes.searchBtn}>
					<i className="icon-search icon-2x" />
					{translate("search")}
				</Fab>
				<Button
					onClick={handleShowPopular}
					className={classes.outlinedBtn}
					color="primary"
					variant="outlined"
					fullWidth
				>
					{"Popular"}
				</Button>
				<Button
					onClick={handleShowAll}
					className={classes.outlinedBtn}
					color="primary"
					variant="outlined"
					fullWidth
				>
					{translate("all")}
				</Button>
			</div>
		);
	}

	function renderContent() {
		if (blocks.openSearch) {
			return <Search />;
		} else if (blocks.openPopular) {
			return <Popular type="tv" bannerWidth={180} useWindowScroll={true} />;
		} else if (blocks.openEpisodes) {
			return <Episodes />;
		}

		return <div />;
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={2} md={3} lg={2}>
				{renderButtons()}
				<Subscriptions
					platform="tv"
					selected={match.params.seriesId}
					idField="externalId"
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
