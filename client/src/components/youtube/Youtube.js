import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles, Grid, Button } from "@material-ui/core";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";

import Follows from "../.partials/Follows";
import Subscriptions from "../.partials/Subscriptions";
import FeedDetail from "../.partials/FeedDetail";
import Feeds from "../.partials/Feeds";
import Videos from "./Videos";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function Youtube() {
	const history = useHistory();
	const match = useRouteMatch();
	const classes = useStyles();
	const [blocks, setBlocks] = useState({
		openFeeds: false,
		openVideos: false,
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
	}, [match.url]);

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
			return <Feeds platform="youtube" />;
		} else if (blocks.openVideos) {
			return <Videos />;
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
				<Follows open={openFollows} platform="youtube" onClose={handleCloseFollows} />
				{renderButtons()}
				<Subscriptions
					platform="youtube"
					selected={match.params.channel}
					idField="externalId"
					action={handleShowVideos}
				/>
				<FeedDetail open={openFeedDetail} platform="youtube" onClose={handleCloseFeedDetail} />
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

export default Youtube;
