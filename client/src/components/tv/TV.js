import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { makeStyles, Grid, Button } from "@material-ui/core";

import TVSidebar from "./TVSidebar";
import FeedBlock from "./FeedBlock";
import ExploreBlock from "./ExploreBlock";
import SearchBlock from "./SearchBlock";
import GroupBlock from "./GroupBlock";
import SerieBlock from "./SerieBlock";

import { translate } from "../../utils/translations";

import { tv as styles } from "../../styles/TV";

const useStyles = makeStyles(styles);

function TV() {
	const history = useHistory();
	const match = useRouteMatch();
	const classes = useStyles();
	const [block, setBlock] = useState("");

	const handleShowGroup = id => {
		if (match.params.groupId !== id) history.push(`/tv/group/${id}`);
	};

	const handleShowFeed = () => {
		history.push("/tv/feed");
	};

	const handleShowExplore = () => {
		history.push("/tv/explore");
	};

	const handleShowSearch = query => {
		if (query !== "") history.push(`/tv/search/${query}`);
	};

	useEffect(() => {
		switch (match.path) {
			case "/tv":
				history.replace("tv/feed");
				break;
			case "/tv/series/:seriesId":
				history.replace(`/tv/series/${match.params.seriesId}/1`);
				break;
			case "/tv/explore":
				setBlock("explore");
				break;
			case "/tv/feed":
				setBlock("feed");
				break;
			case "/tv/series/:seriesId/:season":
				setBlock("series");
				break;
			case "/tv/group/:groupId":
				setBlock("group");
				break;
			case "/tv/search/:search":
				setBlock("search");
				break;
			default:
				break;
		}
	}, [match.path]);

	let currentBlock = null;
	switch (block) {
		case "feed":
			currentBlock = <FeedBlock />;
			break;
		case "explore":
			currentBlock = <ExploreBlock contentType="tv" bannerWidth={180} useWindowScroll />;
			break;
		case "group":
			currentBlock = <GroupBlock groupId={match.params.groupId} />;
			break;
		case "search":
			currentBlock = <SearchBlock query={match.params.search} />;
			break;
		case "series":
			currentBlock = <SerieBlock seriesId={match.params.seriesId} season={match.params.season} />;
			break;
		default:
			break;
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={2} md={3} lg={2}>
				<Button
					onClick={handleShowFeed}
					className={classes.outlinedBtn}
					color={block === "feed" ? "secondary" : "primary"}
					variant={block === "feed" ? "contained" : "outlined"}
					fullWidth
				>
					{"Feed"}
				</Button>
				<Button
					onClick={handleShowExplore}
					className={classes.outlinedBtn}
					color={block === "explore" ? "secondary" : "primary"}
					variant={block === "explore" ? "contained" : "outlined"}
					fullWidth
				>
					{translate("explore")}
				</Button>
				<TVSidebar
					currentGroup={match.params.groupId}
					onGroupClick={handleShowGroup}
					onSearch={handleShowSearch}
				/>
			</Grid>
			<Grid item xs={12} sm={10} md={9} lg={10}>
				{currentBlock}
			</Grid>
		</Grid>
	);
}

export default TV;
