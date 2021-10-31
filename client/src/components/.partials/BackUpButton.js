import React, { useState, useEffect } from "react";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";

import { makeStyles } from "@material-ui/core";
import { IconButton } from "@material-ui/core";

import styles from "../../styles/General";

const useStyles = makeStyles(styles);

function BackUpButton() {
	const classes = useStyles();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		fromEvent(window, "scroll")
			.pipe(debounceTime(250))
			.subscribe(() => {
				const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

				const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

				const scrolled = winScroll / height;

				if ((scrolled > 0.75 || winScroll > 1500) && !open) {
					setOpen(true);
				} else if (winScroll === 0) {
					setOpen(false);
				}
			});
	}, []);

	function handleGoBackUp() {
		window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
	}

	if (open) {
		return (
			<IconButton
				className={classes.goBackUp}
				color="primary"
				style={{ backgroundColor: "#EC6E4C" }}
				onClick={handleGoBackUp}
			>
				<i className="icon-caret-up icon-1x" style={{ fontSize: "1.5rem " }} />
			</IconButton>
		);
	}

	return null;
}

export default BackUpButton;
