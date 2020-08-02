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

import { YoutubeContext } from "../../contexts/YoutubeContext";
import { TwitchContext } from "../../contexts/TwitchContext";

import { getSubscriptions } from "../../api/youtube";
import { getFollows } from "../../api/twitch";
import { addChannels } from "../../api/channels";

import { youtube as styles } from "../../styles/Youtube";

const useStyles = makeStyles(styles);

function Subscriptions({ platform }) {
	const history = useHistory();
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
		handleGetSubscriptions();
	}, []); // eslint-disable-line

	async function handleGetSubscriptions() {
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

	async function handleAddChannels() {
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
							loadMore={handleGetSubscriptions}
							hasMore={pagination.hasMore}
							useWindow={false}
							loader={<Loading key={0} />}
						>
							{renderSubscriptionsList()}
						</InfiniteScroll>
					</Box>
					<Box display="flex" justifyContent="flex-end" className={classes.modalFooter}>
						<Button color="primary" variant="contained" onClick={handleAddChannels}>
							{"Submit"}
						</Button>
					</Box>
				</Paper>
			</Modal>
		</div>
	);
}

Subscriptions.propTypes = {
	platform: PropTypes.string.isRequired,
};

export default Subscriptions;
