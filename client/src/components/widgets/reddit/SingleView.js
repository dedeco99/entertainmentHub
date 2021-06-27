import React from "react";
import PropTypes from "prop-types";

import { makeStyles, Zoom, Box } from "@material-ui/core";

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
							<i className="icon-caret-left" />
						</Box>
						<Box display="flex" onClick={onShowListView} className={classes.header}>
							<i className="icon-feed" />
						</Box>
						<Box display="flex" flex="1" justifyContent="center" alignItems="center" onClick={onShowNextPost}>
							<i className="icon-caret-right" />
						</Box>
					</Box>
				</Box>
			</Box>
		</Zoom>
	);

	/*return (
		<Zoom in={open}>
			<Box variant="outlined" className={classes.root}>
				<Grid container spacing={3}>
					<Grid item xs={8}>
						<Post
							post={post}
							multipleSubs={multipleSubs}
							onShowPreviousPost={onShowPreviousPost}
							onShowNextPost={onShowNextPost}
						/>
					</Grid>
					<Grid item xs={4}></Grid>
				</Grid>
			</Box>
		</Zoom>
		
	);*/
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
