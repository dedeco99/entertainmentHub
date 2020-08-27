import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";

import {
	makeStyles,
	IconButton,
	Modal,
	Backdrop,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	ListItemAvatar,
	Checkbox,
	Avatar,
	Paper,
	Box,
	Button,
} from "@material-ui/core";

import Loading from "../.partials/Loading";

import { RedditContext } from "../../contexts/RedditContext";
import { YoutubeContext } from "../../contexts/YoutubeContext";
import { TwitchContext } from "../../contexts/TwitchContext";

import { getSubreddits } from "../../api/reddit";
import { getSubscriptions } from "../../api/youtube";
import { getFollows } from "../../api/twitch";
import { addSubscriptions } from "../../api/subscriptions";

import { translate } from "../../utils/translations";

import { youtube as styles } from "../../styles/Youtube";

const useStyles = makeStyles(styles);

function chooseContext(platform) {
	switch (platform) {
		case "reddit":
			return RedditContext;
		case "youtube":
			return YoutubeContext;
		case "twitch":
			return TwitchContext;
		default:
			break;
	}
}

function chooseApiCall(platform) {
	switch (platform) {
		case "reddit":
			return getSubreddits;
		case "youtube":
			return getSubscriptions;
		case "twitch":
			return getFollows;
		default:
			break;
	}
}

function Follows({ open, platform, onClose }) {
	const history = useHistory();
	const classes = useStyles();
	const { state, dispatch } = useContext(chooseContext(platform));
	const { follows } = state;
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({
		page: 0,
		hasMore: false,
		after: null,
	});
	const [checkedFollows, setCheckedFollows] = useState([]);
	let isMounted = true;

	useEffect(() => {
		async function fetchData() {
			await handleGetFollows();
		}

		fetchData();

		return () => (isMounted = false); // eslint-disable-line
	}, []); // eslint-disable-line

	async function handleGetFollows() {
		if (!loading) {
			setLoading(true);

			const response = await chooseApiCall(platform)(pagination.after);

			if (response.status === 401) return history.push("/settings");

			if (response.status === 200 && isMounted) {
				let newFollows = pagination.page === 0 ? response.data : follows.concat(response.data);

				dispatch({ type: "SET_FOLLOWS", follows: newFollows });

				setPagination({
					page: pagination.page + 1,
					after: response.data.length ? response.data[0].after : null,
					hasMore: !(response.data.length < 20),
				});
				setLoading(false);
			}
		}
	}

	async function handleAddFollows() {
		const response = await addSubscriptions(platform, checkedFollows);

		if (response.status === 201) {
			dispatch({ type: "ADD_SUBSCRIPTION", subscription: response.data });

			setCheckedFollows([]);
		}
	}

	function handleFollowCheckbox(externalId) {
		const foundFollow = checkedFollows.findIndex(f => f.externalId === externalId);
		const updatedFollows = [...checkedFollows];

		if (foundFollow === -1) {
			const follow = follows.find(f => f.externalId === externalId);

			updatedFollows.push(follow);
		} else {
			updatedFollows.splice(foundFollow, 1);
		}

		setCheckedFollows(updatedFollows);
	}

	function renderFollowsList() {
		if (pagination.page === 0 && loading) return <Loading />;

		return (
			<List className={classes.root}>
				{follows &&
					follows.map(follow => {
						const labelId = `checkbox-list-secondary-label-${follow.externalId}`;
						return (
							<ListItem key={follow.externalId} button onClick={() => handleFollowCheckbox(follow.externalId)}>
								<ListItemAvatar>
									<Avatar alt={follow.title} src={follow.image} />
								</ListItemAvatar>
								<ListItemText id={labelId} primary={follow.displayName} />
								<ListItemSecondaryAction>
									<Checkbox
										color="primary"
										edge="end"
										onChange={() => handleFollowCheckbox(follow.externalId)}
										checked={Boolean(checkedFollows.find(f => f.externalId === follow.externalId))}
										inputProps={{ "aria-labelledby": labelId }}
									/>
								</ListItemSecondaryAction>
							</ListItem>
						);
					})}
			</List>
		);
	}

	return (
		<Modal
			className={classes.modal}
			open={open}
			onClose={onClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
		>
			<Paper variant="outlined" className={classes.modalContent}>
				<Box flexGrow={1} style={{ overflow: "auto" }}>
					<InfiniteScroll
						loadMore={handleGetFollows}
						hasMore={pagination.hasMore}
						useWindow={false}
						loader={<Loading key={0} />}
					>
						{renderFollowsList()}
					</InfiniteScroll>
				</Box>
				<Box display="flex" justifyContent="flex-end" className={classes.modalFooter}>
					<Button color="primary" variant="contained" onClick={handleAddFollows}>
						{translate("submit")}
					</Button>
				</Box>
			</Paper>
		</Modal>
	);
}

Follows.propTypes = {
	open: PropTypes.bool.isRequired,
	platform: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default Follows;
