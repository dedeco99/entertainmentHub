import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core";

import styles from "../../styles/General";

import goBackUp from "../../img/go_back_up.png";

const useStyles = makeStyles(styles);

function BackUpButton() {
	const classes = useStyles();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		window.addEventListener("scroll", () => {
			const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

			const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

			const scrolled = winScroll / height;

			if (scrolled > 0.75 && !open) {
				setOpen(true);
			} else if (scrolled === 0) {
				setOpen(false);
			}
		});
	}, []);

	function handleGoBackUp() {
		window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
	}

	if (open) {
		return (
			<div className={classes.goBackUp} onClick={handleGoBackUp}>
				<img src={goBackUp} width="50px" alt="Go Back Up" />
			</div>
		);
	}

	return null;
}

export default BackUpButton;