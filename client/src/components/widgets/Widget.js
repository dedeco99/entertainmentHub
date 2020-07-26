import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { makeStyles } from "@material-ui/styles";
import Zoom from "@material-ui/core/Zoom";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import { WidgetContext } from "../../contexts/WidgetContext";
import { UserContext } from "../../contexts/UserContext";

import { deleteWidget } from "../../api/widgets";

import { widget as styles } from "../../styles/Widgets";

const useStyles = makeStyles(styles);

const variants = {
	hiddenR: {
		y: 50,
		top: -45,
		right: 100,
		position: "absolute",
		zIndex: -1,
	},
	hiddenE: {
		y: 50,
		top: -45,
		right: 50,
		position: "absolute",
		zIndex: -1,
	},
	hiddenD: {
		y: 50,
		top: -45,
		right: 0,
		position: "absolute",
		zIndex: -1,
	},
	visibleR: {
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
	exitE: {
		y: 50,
		transition: {
			delay: 0.05,
		},
	},
	exitD: {
		y: 50,
		transition: {
			delay: 0.1,
		},
	},
};

function Widget({ id, type, content, borderColor, editText, editIcon }) {
	const { widgetState, dispatch } = useContext(WidgetContext);
	const { editMode } = widgetState;
	const { user } = useContext(UserContext);
	const classes = useStyles({ borderColor: user.settings && user.settings.borderColor ? borderColor : null });
	const [refreshToken, setRefreshToken] = useState(new Date());
	const [hovered, setHovered] = useState(false);

	function handleRefresh() {
		setRefreshToken(new Date());
	}

	function handleEdit() {
		dispatch({ type: "SET_EDIT_MODE", editMode: !editMode });
	}

	async function handleDelete() {
		const response = await deleteWidget(id);

		if (response.status < 400) {
			dispatch({ type: "DELETE_WIDGET", widget: response.data });
		}
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
					React.cloneElement(content, { key: refreshToken })
				)}
				<AnimatePresence>
					{hovered && (
						<>
							<motion.div variants={variants} initial="hiddenR" animate="visibleR" exit="exitR">
								<Paper component={Box} className={classes.action} onClick={handleRefresh}>
									<IconButton size="small">
										<i className="icofont-refresh" />
									</IconButton>
								</Paper>
							</motion.div>
							<motion.div variants={variants} initial="hiddenE" animate="visibleE" exit="exitE">
								<Paper component={Box} className={classes.action} onClick={handleEdit}>
									<IconButton size="small">
										<i className="icofont-expand" />
									</IconButton>
								</Paper>
							</motion.div>
							<motion.div variants={variants} initial="hiddenD" animate="visibleD" exit="exitD">
								<Paper component={Box} className={classes.action} onClick={handleDelete}>
									<IconButton size="small">
										<i className="icofont-ui-delete" />
									</IconButton>
								</Paper>
							</motion.div>
						</>
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
};

export default Widget;
