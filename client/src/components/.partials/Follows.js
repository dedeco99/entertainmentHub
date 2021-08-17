import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import { Subject } from "rxjs";
import { distinctUntilChanged, tap, debounceTime } from "rxjs/operators";

import {
	makeStyles,
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
	InputAdornment,
} from "@material-ui/core";

import Loading from "../.partials/Loading";
import Input from "../.partials/Input";

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
	const { follows, subscriptions } = state;
	const [pagination, setPagination] = useState({ page: 0, hasMore: true, after: null });
	const [filter, setFilter] = useState({ type: "mine", query: "" });
	const [checkedFollows, setCheckedFollows] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loader, setLoader] = useState(false);
	const [callApi, setCallApi] = useState(false);
	let isMounted = true;

	const submitSubject = new Subject();
	const inputSubject = new Subject();

	useEffect(() => {
		const subscription = submitSubject
			.pipe(distinctUntilChanged((a, b) => a.checkedFollows === b.checkedFollows))
			.subscribe(async () => {
				const response = await addSubscriptions(platform, checkedFollows);

				if (response.status === 201) {
					dispatch({ type: "ADD_SUBSCRIPTION", subscription: response.data });

					setCheckedFollows([]);
				}
			});
		return () => subscription.unsubscribe();
	});

	useEffect(() => {
		const subscription = inputSubject
			.pipe(
				tap(value => {
					setLoader(true);
					setFilter({ type: value ? "search" : "mine", query: value });
				}),
				debounceTime(1000),
			)
			.subscribe(() => {
				setPagination({ page: 0, hasMore: true, after: null });
				setCallApi(!callApi);
			});
	});

	async function handleGetFollows() {
		if (!loading && pagination.hasMore) {
			setLoading(true);

			const response = await chooseApiCall(platform)(pagination.after, filter.type, filter.query);

			if (response.status === 401) return history.push("/settings");

			if (response.status === 200 && isMounted) {
				let newFollows = pagination.page === 0 ? response.data : follows.concat(response.data);

				dispatch({ type: "SET_FOLLOWS", filter: filter.type, follows: newFollows });

				setPagination(prev => ({
					page: prev.page + 1,
					hasMore: !(response.data.length < 20),
					after: response.data.length ? response.data[0].after : null,
				}));
				setLoading(false);
				setLoader(false);
			}
		}
	}

	useEffect(() => {
		async function fetchData() {
			await handleGetFollows();
		}

		fetchData();
	}, [callApi]);

	async function handleSearchFollows(e) {
		inputSubject.next(e.target.value);
	}

	async function handleAddFollows() {
		submitSubject.next({ checkedFollows });
	}

	function handleFollowCheckbox(externalId) {
		const foundFollow = checkedFollows.findIndex(f => f.externalId === externalId);
		const updatedFollows = [...checkedFollows];

		if (foundFollow === -1) {
			const follow = follows.find(f => f.externalId === externalId);

			updatedFollows.push({ ...follow, group: { name: "Ungrouped", pos: 0 } });
		} else {
			updatedFollows.splice(foundFollow, 1);
		}

		setCheckedFollows(updatedFollows);
	}

	function renderFollowsList() {
		return (
			<List className={classes.root}>
				{follows &&
					follows.map(follow => {
						const isSubscription = subscriptions.map(s => s.externalId).includes(follow.externalId);
						const isChecked = checkedFollows.find(f => f.externalId === follow.externalId);
						const labelId = `checkbox-list-secondary-label-${follow.externalId}`;

						return (
							<ListItem key={follow.externalId} button onClick={() => handleFollowCheckbox(follow.externalId)}>
								<ListItemAvatar>
									<Avatar alt={follow.title} src={follow.image} />
								</ListItemAvatar>
								{filter.type === "mine" ? (
									<>
										<ListItemText id={labelId} primary={follow.displayName} />
										<ListItemSecondaryAction>
											<Checkbox
												color="primary"
												edge="end"
												onChange={() => handleFollowCheckbox(follow.externalId)}
												checked={Boolean(isChecked)}
												inputProps={{ "aria-labelledby": labelId }}
											/>
										</ListItemSecondaryAction>
									</>
								) : (
									<>
										<ListItemText
											id={labelId}
											primary={follow.displayName}
											secondary={follow.isSubscribed && "Subscribed"}
										/>
										<ListItemSecondaryAction>
											<Checkbox
												color="primary"
												edge="end"
												onChange={() => handleFollowCheckbox(follow.externalId)}
												checked={isSubscription || Boolean(isChecked)}
												inputProps={{ "aria-labelledby": labelId }}
												disabled={isSubscription}
											/>
										</ListItemSecondaryAction>
									</>
								)}
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
					{loader ? (
						<Loading />
					) : (
						<InfiniteScroll
							loadMore={handleGetFollows}
							hasMore={pagination.hasMore}
							useWindow={false}
							loader={<Loading key={0} />}
						>
							{renderFollowsList()}
						</InfiniteScroll>
					)}
				</Box>
				<Box display="flex" justifyContent="flex-end" className={classes.modalFooter}>
					<Input
						id="search"
						label={translate("search")}
						value={filter.query}
						onChange={handleSearchFollows}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<i className="icon-search icon-1.9x" style={{ fontSize: "1.4em" }} />
								</InputAdornment>
							),
							style: { height: "43px" },
						}}
						variant="outlined"
						style={{ marginRight: "30px", marginTop: "10px", marginBottom: "15px" }}
					/>
					<Button
						color="primary"
						variant="contained"
						onClick={handleAddFollows}
						style={{ marginTop: "11px", height: "40px" }}
					>
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
