import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import ListSubheader from "@material-ui/core/ListSubheader";

const useStyles = makeStyles({
	wrapper: {
		display: "inline-block",
		position: "relative",
	},
	paper: {
		position: "absolute",
		width: 250,
		right: 0,
		backgroundColor: "#212121",
	},
	list: {
		paddingBottom: 0,
	},
});

export default function Dropdown() {
	const classes = useStyles();
	const [
		open,
		setOpen,
	] = React.useState(false);

	const handleClick = () => {
		setOpen(prev => !prev);
	};

	const handleClickAway = () => {
		setOpen(false);
	};

	const getNotifications = () => {
		return (
			<ListItem button divider>
				<ListItemAvatar>
					<Avatar style={{ backgroundColor: "#444" }}>
						<i className="material-icons">{"tv"}</i>
					</Avatar>
				</ListItemAvatar>
				<ListItemText
					primary={"Hello there im rodrigo here to help you"}
					secondary={"12-12-1212 12:12"}
					primaryTypographyProps={{ noWrap: true }}
				/>
			</ListItem>
		);
	};

	return (
		<ClickAwayListener onClickAway={handleClickAway}>
			<div className={classes.wrapper}>
				<IconButton onClick={handleClick}>
					<i className="icofont-alarm" />
				</IconButton>
				{open
					? <Paper variant="outlined" className={classes.paper}>
						<List
							component="nav"
							aria-labelledby="nested-list-subheader"
							subheader={
								<ListSubheader component="div" id="nested-list-subheader">
                                    Notifications
								</ListSubheader>
							}
							className={classes.list}
						>
							<Divider />
                            {getNotifications()}
							<Button size="small" fullWidth style={{ borderRadius: 0 }}>See All</Button>
						</List>
					</Paper>
					: null}
			</div>
		</ClickAwayListener>
	);
}
