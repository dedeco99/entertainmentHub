import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles, Grid, Button } from "@material-ui/core";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";

import Follows from "../.partials/Follows";
import Subscriptions from "../.partials/Subscriptions";
import FeedDetail from "../.partials/FeedDetail";
import Feeds from "../.partials/Feeds";
import Posts from "./Posts";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Reddit() {
	const history = useHistory();
	const match = useRouteMatch();
	const classes = useStyles();
	const [blocks, setBlocks] = useState({
		openFeeds: false,
		openPosts: false,
	});
	const [openOptions, setOpenOptions] = useState(false);
	const [openFeedDetail, setOpenFeedDetail] = useState(false);
	const [openFollows, setOpenFollows] = useState(false);

	function handleOpenOptions() {
		setOpenOptions(true);
	}

	function handleCloseOptions() {
		setOpenOptions(false);
	}

	function handleOpenFeedDetail() {
		setOpenFeedDetail(true);
	}

	function handleCloseFeedDetail() {
		setOpenFeedDetail(false);
	}

	function handleOpenFollows() {
		setOpenFollows(true);
	}

	function handleCloseFollows() {
		setOpenFollows(false);
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
			history.push(`/reddit/${id}/hot`);

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

	const actions = [
		{ name: "Add Subscriptions", icon: <i className="icon-user" />, handleClick: handleOpenFollows },
		{ name: "Add Feed", icon: <i className="icon-feed" />, handleClick: handleOpenFeedDetail },
	];

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={2} md={3} lg={2}>
				<Follows open={openFollows} platform="reddit" onClose={handleCloseFollows} />
				{renderButtons()}
				<Subscriptions
					platform="reddit"
					selected={match.params.sub}
					idField="externalId"
					action={handleShowPosts}
				/>
				<FeedDetail open={openFeedDetail} platform="reddit" onClose={handleCloseFeedDetail} />
			</Grid>
			<Grid item xs={12} sm={10} md={9} lg={10}>
				{renderContent()}
			</Grid>
			<SpeedDial
				ariaLabel="Options"
				icon={<i className="icon-add" />}
				onClose={handleCloseOptions}
				onOpen={handleOpenOptions}
				open={openOptions}
				className={classes.speedDial}
				FabProps={{ size: "small" }}
			>
				{actions.map(action => (
					<SpeedDialAction
						key={action.name}
						icon={action.icon}
						tooltipTitle={action.name}
						onClick={action.handleClick}
					/>
				))}
			</SpeedDial>
		</Grid>
	);
}

export default Reddit;
