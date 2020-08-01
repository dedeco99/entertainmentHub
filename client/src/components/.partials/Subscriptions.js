import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import InfiniteScroll from "react-infinite-scroller";

import IconButton from "@material-ui/core/IconButton";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

import Loading from "../.partials/Loading";

import { YoutubeContext } from "../../contexts/YoutubeContext";
import { TwitchContext } from "../../contexts/TwitchContext";

import { getSubscriptions } from "../../api/youtube";
import { getFollows } from "../../api/twitch";
import { addChannels } from "../../api/channels";

import { youtube as styles } from "../../styles/Youtube";

const useStyles = makeStyles(styles);

function Subscriptions({ platform, history }) {
	const classes = useStyles();
	const { state, dispatch } = useContext(platform === "youtube" ? YoutubeContext : TwitchContext);
	const { subscriptions } = state;
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState({
		page: 0,
		hasMore: false,
		after: null,
	});
	const [checkedChannels, setCheckedChannels] = useState([]);
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		getSubscriptionsCall();
	}, []); // eslint-disable-line

	async function getSubscriptionsCall() {
		if (!loading) {
			setLoading(true);

			// prettier-ignore
			const response = platform === "youtube"
				? await getSubscriptions(pagination.after)
				: await getFollows(pagination.after);

			if (response.status === 401) return history.push("/settings");

			if (response.status === 200) {
				let newSubscriptions = pagination.page === 0 ? response.data : subscriptions.concat(response.data);

				dispatch({ type: "SET_SUBSCRIPTIONS", subscriptions: newSubscriptions });

				setPagination({
					page: pagination.page + 1,
					after: response.data[0].after,
					hasMore: !(response.data.length < 20),
				});
				setLoading(false);
			}
		}
	}

	async function addChannelsCall() {
		const response = await addChannels(platform, checkedChannels);

		if (response.status === 201) {
			dispatch({ type: "ADD_CHANNEL", channel: response.data });

			setCheckedChannels([]);
		}
	}

	function handleOpenModal() {
		setOpenModal(true);
	}

	function handleCloseModal() {
		setOpenModal(false);
	}

	function handleSubscriptionCheckbox(channelId) {
		const foundChannel = checkedChannels.findIndex(channel => channel.channelId === channelId);
		const updatedChannels = [...checkedChannels];

		if (foundChannel === -1) {
			const subscription = subscriptions.find(channel => channel.channelId === channelId);

			updatedChannels.push(subscription);
		} else {
			updatedChannels.splice(foundChannel, 1);
		}

		setCheckedChannels(updatedChannels);
	}

	function renderSubscriptionsList() {
		return (
			<List className={classes.root}>
				{subscriptions &&
					subscriptions.map(channel => {
						const labelId = `checkbox-list-secondary-label-${channel.channelId}`;
						return (
							<ListItem
								key={channel.channelId}
								button
								onClick={() => handleSubscriptionCheckbox(channel.channelId)}
							>
								<ListItemAvatar>
									<Avatar alt={channel.title} src={channel.logo} />
								</ListItemAvatar>
								<ListItemText id={labelId} primary={channel.displayName} />
								<ListItemSecondaryAction>
									<Checkbox
										color="primary"
										edge="end"
										onChange={() => handleSubscriptionCheckbox(channel.channelId)}
										checked={Boolean(checkedChannels.find(c => c.channelId === channel.channelId))}
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
		<div>
			<IconButton color="primary" onClick={handleOpenModal}>
				<i className="icofont-ui-add" />
			</IconButton>
			<Modal
				className={classes.modal}
				open={openModal}
				onClose={handleCloseModal}
				closeAfterTransition
				BackdropComponent={Backdrop}
			>
				<Paper variant="outlined" className={classes.modalContent}>
					<Box flexGrow={1} style={{ overflow: "auto" }}>
						<InfiniteScroll
							loadMore={getSubscriptionsCall}
							hasMore={pagination.hasMore}
							useWindow={false}
							loader={<Loading key={0} />}
						>
							{renderSubscriptionsList()}
						</InfiniteScroll>
					</Box>
					<Box display="flex" justifyContent="flex-end" className={classes.modalFooter}>
						<Button color="primary" variant="contained" onClick={addChannelsCall}>
							{"Submit"}
						</Button>
					</Box>
				</Paper>
			</Modal>
		</div>
	);
}

Subscriptions.propTypes = {
	history: PropTypes.object.isRequired,
	platform: PropTypes.string.isRequired,
};

export default Subscriptions;
