import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { makeStyles, Zoom, Box, Paper, Typography, IconButton } from "@material-ui/core";

import { WidgetContext } from "../../contexts/WidgetContext";
import { UserContext } from "../../contexts/UserContext";

import { widget as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

const variants = {
	hidden: {
		y: 50,
	},
	visibleR: {
		y: 0,
		transition: {
			delay: 0.15,
		},
	},
	visibleM: {
		y: 0,
		transition: {
			delay: 0.1,
		},
	},
	visibleE: {
		y: 0,
		transition: {
			delay: 0.05,
		},
	},
	visibleD: {
		y: 0,
	},
	exitR: {
		y: 50,
	},
	exitM: {
		y: 50,
		transition: {
			delay: 0.05,
		},
	},
	exitE: {
		y: 50,
		transition: {
			delay: 0.1,
		},
	},
	exitD: {
		y: 50,
		transition: {
			delay: 0.15,
		},
	},
};

function Widget({ id, type, content, borderColor, editText, editIcon, widgetDimensions, onEdit, onDelete }) {
	const { state, dispatch } = useContext(WidgetContext);
	const { editMode } = state;
	const { user } = useContext(UserContext);
	const classes = useStyles({ borderColor: user.settings && user.settings.borderColor ? borderColor : null });
	const [refreshToken, setRefreshToken] = useState(new Date());
	const [hovered, setHovered] = useState(false);

	function handleRefresh() {
		setRefreshToken(new Date());
	}

	function handleMove() {
		dispatch({ type: "SET_EDIT_MODE", editMode: !editMode });
	}

	function handleEdit() {
		onEdit(id);
	}

	function handleDelete() {
		onDelete(id);
	}

	function handleShowActions() {
		setHovered(true);
	}

	function handleHideActions() {
		setHovered(false);
	}

	const nonAppWidgets = ["notifications", "weather", "crypto"];
	const hasApp = user.apps
		? user.apps.find(app => app.platform === type || nonAppWidgets.includes(type))
		: nonAppWidgets.includes(type);

	return (
		<Zoom in>
			<Box className={classes.root} onMouseEnter={handleShowActions} onMouseLeave={handleHideActions}>
				{editMode || !hasApp ? (
					<>
						<i className={`${editIcon} icofont-2x`} />
						<Typography variant="subtitle2">{editText}</Typography>
						{!hasApp && (
							<Typography variant="subtitle2">
								<NavLink className={classes.appLink} to="/settings">
									{"App is missing. Click here to add it"}
								</NavLink>
							</Typography>
						)}
					</>
				) : (
					React.cloneElement(content, { key: refreshToken, widgetDimensions })
				)}
				<AnimatePresence>
					{hovered && (
						<div className={classes.actions}>
							<motion.div variants={variants} initial="hidden" animate="visibleR" exit="exitR">
								<Paper component={Box} className={classes.action} onClick={handleRefresh}>
									<IconButton size="small">
										<i className="icofont-refresh" />
									</IconButton>
								</Paper>
							</motion.div>
							<motion.div variants={variants} initial="hidden" animate="visibleM" exit="exitM">
								<Paper component={Box} className={classes.action} onClick={handleMove}>
									<IconButton size="small">
										<i className="icofont-expand" />
									</IconButton>
								</Paper>
							</motion.div>
							{onEdit && (
								<motion.div variants={variants} initial="hidden" animate="visibleE" exit="exitE">
									<Paper component={Box} className={classes.action} onClick={handleEdit}>
										<IconButton size="small">
											<i className="icofont-ui-edit" />
										</IconButton>
									</Paper>
								</motion.div>
							)}
							{onDelete && (
								<motion.div variants={variants} initial="hidden" animate="visibleD" exit="exitD">
									<Paper component={Box} className={classes.action} onClick={handleDelete}>
										<IconButton size="small">
											<i className="icofont-ui-delete" />
										</IconButton>
									</Paper>
								</motion.div>
							)}
						</div>
					)}
				</AnimatePresence>
			</Box>
		</Zoom>
	);
}

Widget.propTypes = {
	id: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	content: PropTypes.node.isRequired,
	borderColor: PropTypes.string,
	editText: PropTypes.string.isRequired,
	editIcon: PropTypes.string.isRequired,
	widgetDimensions: PropTypes.object,
	onEdit: PropTypes.func,
	onDelete: PropTypes.func,
};

export default Widget;
