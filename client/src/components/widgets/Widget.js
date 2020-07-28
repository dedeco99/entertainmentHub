import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import Zoom from "@material-ui/core/Zoom";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import { WidgetContext } from "../../contexts/WidgetContext";
import { UserContext } from "../../contexts/UserContext";

import { deleteWidget } from "../../api/widgets";

import { widget as useStyles } from "../../styles/Widgets";
import { AnimatePresence, motion } from "framer-motion";

const variants = {
	hidden: {
		y: 50,
		top: -45,
		right: 0,
		position: "absolute",
		zIndex: -1,
	},
	visible: {
		y: 0,
	},
	exit: {
		y: 50,
	},
};

function Widget({ id, type, content, borderColor, editText, editIcon, editMode, widgetDimensions }) {
	const { dispatch } = useContext(WidgetContext);
	const { user } = useContext(UserContext);
	const classes = useStyles({ borderColor: (user.settings && user.settings.borderColor ? borderColor : null) });
	const [refreshToken, setRefreshToken] = useState(new Date());
	const [hovered, setHovered] = useState(false);

	async function handleDelete() {
		const response = await deleteWidget(id);

		if (response.status < 400) {
			dispatch({ type: "DELETE_WIDGET", widget: response.data });
		}
	}

	function handleRefresh() {
		setRefreshToken(new Date());
	}

	if (editMode) {
		return (
			<div className={classes.root}>
				<IconButton color="primary" className={classes.delete} onClick={handleDelete}>
					<i className="icofont-ui-delete" />
				</IconButton>
				<i className={`${editIcon} icofont-2x`} />
				<Typography variant="subtitle2">
					{editText}
				</Typography>
			</div>
		);
	}

	const nonAppWidgets = ["notifications", "weather", "crypto"];
	const hasApp = user.apps.find(app => app.platform === type || nonAppWidgets.includes(type));

	if (!hasApp) {
		return (
			<Zoom in>
				<div className={classes.root}>
					<i className={`${editIcon} icofont-2x`} />
					<Typography variant="subtitle2">
						{editText}
					</Typography>
					<Typography variant="subtitle2">
						<NavLink className={classes.appLink} to="/settings">{"App is missing. Click here to add it"}</NavLink>
					</Typography>
				</div>
			</Zoom>
		);
	}

	return (
		<Zoom in>
			<Box
				className={classes.root}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			>
				{React.cloneElement(content, { key: refreshToken, widgetDimensions })}
				<AnimatePresence>
					{hovered && (
						<motion.div
							variants={variants}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							<Paper
								component={Box}
								className={classes.refresh}
								onClick={handleRefresh}
							>
								<IconButton size="small">
									<i className="icofont-refresh" />
								</IconButton>
							</Paper>
						</motion.div>
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
	editMode: PropTypes.bool.isRequired,
	widgetDimensions: PropTypes.object.isRequired,
};

export default Widget;
