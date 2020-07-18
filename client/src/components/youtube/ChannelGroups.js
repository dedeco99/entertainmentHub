import React, { Component } from "react";
import PropTypes from "prop-types";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

import { getChannels } from "../../api/channels";


class ChannelGroups extends Component {
	constructor(props) {
		super(props);

		this.state = {
			channelGroups: [],
		};
	}

	render() {
		const { open, onClose } = this.props;

		return (
			<Dialog
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				open={open}
				fullWidth
				maxWidth="xs"
			>
				<DialogTitle id="simple-dialog-title">{"Add Channel Group"}</DialogTitle>
				<DialogContent />
				<DialogActions>
					<Button onClick={onClose} color="primary">
						{"Close"}
                    </Button>
					<Button color="primary" autoFocus>
						{"Add"}
                    </Button>
				</DialogActions>
			</Dialog>
		);
	}
}

ChannelGroups.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default ChannelGroups;
