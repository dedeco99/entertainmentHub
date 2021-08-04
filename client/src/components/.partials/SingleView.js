import React from "react";
import PropTypes from "prop-types";

import { makeStyles, Zoom, Box } from "@material-ui/core";

import { reddit as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

function SingleView({ open, content, onShowPrevious, onShowNext, onShowListView }) {
	const classes = useStyles();

	return (
		<Zoom in={open}>
			<Box variant="outlined" className={classes.root}>
				<Box display="flex" flexDirection="column" className={classes.wrapper}>
					{content}
					<Box display="flex" className={classes.arrows}>
						<Box display="flex" flex="1" justifyContent="center" alignItems="center" onClick={onShowPrevious}>
							<i className="icon-caret-left" />
						</Box>
						<Box display="flex" onClick={onShowListView} className={classes.header}>
							<i className="icon-feed" />
						</Box>
						<Box display="flex" flex="1" justifyContent="center" alignItems="center" onClick={onShowNext}>
							<i className="icon-caret-right" />
						</Box>
					</Box>
				</Box>
			</Box>
		</Zoom>
	);
}

SingleView.propTypes = {
	open: PropTypes.bool.isRequired,
	content: PropTypes.element.isRequired,
	onShowPrevious: PropTypes.func.isRequired,
	onShowNext: PropTypes.func.isRequired,
	onShowListView: PropTypes.func.isRequired,
};

export default SingleView;
