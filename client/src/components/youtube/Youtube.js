import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles, Grid, IconButton, Button } from "@material-ui/core";

import Follows from "../.partials/Follows";
import Subscriptions from "../.partials/Subscriptions";
import FeedDetail from "../.partials/FeedDetail";
import Feeds from "../.partials/Feeds";
import Videos from "./Videos";

import { youtube as styles } from "../../styles/Youtube";

const useStyles = makeStyles(styles);

function Youtube() {
	const history = useHistory();
	const match = useRouteMatch();
	const classes = useStyles();
	const [blocks, setBlocks] = useState({
		openFeeds: false,
		openVideos: false,
	});
	const [openModal, setOpenModal] = useState(false);
	
	function handleOpenModal() {
		setOpenModal(true);
	}

	function handleCloseModal() {
		setOpenModal(false);
	}

	function handleShowFeedsBlock() {
		setBlocks({ openFeeds: true, openVideos: false });
	}

	function handleShowVideosBlock() {
		setBlocks({ openFeeds: false, openVideos: true });
	}

	function handleShowFeeds() {
		history.push("/youtube");

		handleShowFeedsBlock();
	}

	function handleShowVideos(id) {
		if (match.params.channel !== id) {
			history.push(`/youtube/${id}`);

			handleShowVideosBlock();
		}
	}

	useEffect(() => {
		switch (match.path) {
			case "/youtube":
				handleShowFeedsBlock();
				break;
			case "/youtube/:channel":
				handleShowVideosBlock();
				break;
			default:
				break;
		}
	}, [match.url]); // eslint-disable-line

	function renderButtons(){
		return (
			<div align="center">
				<Button
					onClick={handleShowFeeds}
					className={classes.outlinedBtn}
					color="primary"
					variant="outlined"
					fullWidth
				>
					{"Feeds"}
				</Button>
			</div>
		);
	}

	function renderContent() {
		if (blocks.openFeeds) {
			return <Feeds platform="youtube" />;
		} else if (blocks.openVideos) {
			return <Videos />
		}

		return <div />;
	}

	return (
		<Grid container spacing={2}>
			<Grid item sm={3} md={2}>
				<Follows platform="youtube" />
				{renderButtons()}
				<Subscriptions
					platform="youtube"
					selected={match.params.channel}
					idField="externalId"
					action={handleShowVideos}
				/>
				<IconButton onClick={handleOpenModal}>
					<i className="icofont-ui-add" />
				</IconButton>
				<FeedDetail open={openModal} platform="youtube" onClose={handleCloseModal} />
			</Grid>
			<Grid item sm={9} md={10}>
				{renderContent()}
			</Grid>
		</Grid>
	);
}

export default Youtube;
