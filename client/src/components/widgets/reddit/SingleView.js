import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

import Zoom from "@material-ui/core/Zoom";
import Box from "@material-ui/core/Box";

import Post from "../../reddit/Post";

import { reddit as styles } from "../../../styles/Widgets";

const useStyles = makeStyles(styles);

function SingleView({ open, post, multipleSubs, onShowPreviousPost, onShowNextPost, onShowListView }) {
	const classes = useStyles();

	return (
		<Zoom in={open}>
			<Box variant="outlined" className={classes.root}>
				<Box display="flex" flexDirection="column" className={classes.wrapper}>
					<Post
						post={post}
						multipleSubs={multipleSubs}
						onShowPreviousPost={onShowPreviousPost}
						onShowNextPost={onShowNextPost}
					/>
					<Box display="flex" className={classes.arrows}>
						<Box display="flex" flex="1" justifyContent="center" alignItems="center" onClick={onShowPreviousPost}>
							<i className="icofont-caret-left" />
						</Box>
						<Box display="flex" onClick={onShowListView} className={classes.header}>
							<i className="icofont-listing-box" />
						</Box>
						<Box display="flex" flex="1" justifyContent="center" alignItems="center" onClick={onShowNextPost}>
							<i className="icofont-caret-right" />
						</Box>
					</Box>
				</Box>
			</Box>
		</Zoom>
	);
}

SingleView.propTypes = {
	open: PropTypes.bool.isRequired,
	post: PropTypes.object.isRequired,
	multipleSubs: PropTypes.bool.isRequired,
	onShowPreviousPost: PropTypes.func.isRequired,
	onShowNextPost: PropTypes.func.isRequired,
	onShowListView: PropTypes.func.isRequired,
};

export default SingleView;
