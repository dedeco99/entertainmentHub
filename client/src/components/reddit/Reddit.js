import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles, Grid, IconButton, Button } from "@material-ui/core";

import Follows from "../.partials/Follows";
import Subscriptions from "../.partials/Subscriptions";
import FeedDetail from "../.partials/FeedDetail";
import Feeds from "../.partials/Feeds";
import Posts from "./Posts";

import { tv as styles } from "../../styles/TV";

const useStyles = makeStyles(styles);

function Reddit() {
	const history = useHistory();
	const match = useRouteMatch();
	const classes = useStyles();
	const [blocks, setBlocks] = useState({
		openFeeds: false,
		openPosts: false,
	});
	const [openModal, setOpenModal] = useState(false);

	function handleOpenModal() {
		setOpenModal(true);
	}

	function handleCloseModal() {
		setOpenModal(false);
	}

	function handleShowFeedsBlock() {
		setBlocks({ openFeeds: true, openPosts: false });
	}

	function handleShowPostsBlock() {
		setBlocks({ openFeeds: false, openPosts: true });
	}

	function handleShowFeeds() {
		history.push("/reddit");

		handleShowFeedsBlock();
	}

	function handleShowPosts(id) {
		if (match.params.sub !== id) {
			history.push(`/reddit/${id}`);

			handleShowPostsBlock();
		}
	}

	useEffect(() => {
		switch (match.path) {
			case "/reddit":
				handleShowFeedsBlock();
				break;
			case "/reddit/:sub":
				history.push(`/reddit/${match.params.sub}/hot`);
				break;
			case "/reddit/:sub/:category":
				handleShowPostsBlock();
				break;
			default:
				break;
		}
	}, [match.url]); // eslint-disable-line

	function renderButtons() {
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
			return <Feeds platform="reddit" />;
		} else if (blocks.openPosts) {
			return <Posts />;
		}

		return <div />;
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={2} md={3} lg={2}>
				<Follows platform="reddit" />
				{renderButtons()}
				<Subscriptions
					platform="reddit"
					selected={match.params.sub}
					idField="externalId"
					action={handleShowPosts}
				/>
				<IconButton onClick={handleOpenModal}>
					<i className="icon-add" />
				</IconButton>
				<FeedDetail open={openModal} platform="reddit" onClose={handleCloseModal} />
			</Grid>
			<Grid item xs={12} sm={10} md={9} lg={10}>
				{renderContent()}
			</Grid>
		</Grid>
	);
}

export default Reddit;
