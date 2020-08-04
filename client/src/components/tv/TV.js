import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles, Grid, Fab, Button } from "@material-ui/core";

import Subscriptions from "../.partials/Subscriptions";
import Episodes from "./Episodes";
import Search from "./Search";
import Popular from "./Popular";

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
		history.push(`/tv/${id}`);

		handleShowEpisodesBlock();
	}

	function handleShowAll() {
		handleShowEpisodes("all");
	}

	useEffect(() => {
		switch (match.path) {
			case "/tv":
				history.replace("tv/all");
				break;
			default:
				break;
		}
	}, [match.url]); // eslint-disable-line

	function renderButtons() {
		return (
			<div align="center">
				<Fab onClick={handleShowSearchBlock} variant="extended" size="medium" className={classes.searchBtn}>
					<i className="material-icons">{"search"}</i>
					{"Search"}
				</Fab>
				<Button
					onClick={handleShowPopularBlock}
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
					{"All"}
				</Button>
			</div>
		);
	}

	function renderContent() {
		if (blocks.openSearch) {
			return <Search />;
		} else if (blocks.openPopular) {
			return <Popular />;
		} else if (blocks.openEpisodes) {
			return <Episodes />;
		}

		return <div />;
	}

	return (
		<Grid container spacing={2}>
			<Grid item sm={3} md={2}>
				{renderButtons()}
				<Subscriptions
					platform="tv"
					selected={match.params.seriesId}
					idField="externalId"
					action={handleShowEpisodes}
				/>
			</Grid>
			<Grid item sm={9} md={10} lg={10}>
				{renderContent()}
			</Grid>
		</Grid>
	);
}

export default TV;
