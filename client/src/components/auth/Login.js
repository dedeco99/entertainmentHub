import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { makeStyles, Grid, Button, Container, Box, Hidden } from "@material-ui/core";

import Input from "../.partials/Input";
import Register from "./Register";

import { UserContext } from "../../contexts/UserContext";

import { login } from "../../api/auth";

import { translate } from "../../utils/translations";

import { login as styles } from "../../styles/Login";

import logo from "../../img/logo_big.png";
import login0 from "../../img/login/login_0.png";

const useStyles = makeStyles(styles);

const containerVariants = {
	hidden: {
		x: "-50%",
		opacity: 0,
	},
	visible: {
		x: 0,
		opacity: 1,
		transition: { type: "tween", duration: 0.5 },
	},
	exit: {
		x: "50%",
		opacity: 0,
		transition: { type: "tween", duration: 0.5 },
	},
};

const imageVariants = {
	hidden: {
		x: window.innerWidth,
		opacity: 0,
	},
	visible: {
		x: 0,
		opacity: 1,
		transition: { type: "tween", duration: 1 },
	},
};

function Login() {
	const history = useHistory();
	const classes = useStyles();
	const { user, dispatch } = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [openRegister, setOpenRegister] = useState(false);

	useEffect(() => {
		if (user && user.token) history.push("/");
	}, []); // eslint-disable-line

	function handleEmailChange(e) {
		setEmail(e.target.value);
	}

	function handlePasswordChange(e) {
		setPassword(e.target.value);
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const response = await login({ email, password });

		if (response.status === 200) {
			dispatch({ type: "SET_USER", user: { ...response.data.user, token: response.data.token } });

			history.push("/");
		}
	}

	function handleOpenRegister() {
		setOpenRegister(true);
	}

	function handleHideRegister() {
		setOpenRegister(false);
	}

	return (
		<div className={classes.root}>
			<Grid container spacing={2}>
				<Grid item xs={12} md={5}>
					<AnimatePresence exitBeforeEnter>
						<motion.div
							key={openRegister}
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							<Container maxWidth="xs" className={classes.container}>
								<img src={logo} alt="Logo" width="100%" />
								<Box className={classes.formContainer}>
									<Box display="flex" justifyContent="center">
										<Box display="flex" flexGrow={1} justifyContent="flex-start">
											<h4>{openRegister ? "Register" : "Login"}</h4>
										</Box>
										<Box display="flex" flexGrow={1} justifyContent="flex-end">
											<h4
												className={classes.createAccount}
												onClick={openRegister ? handleHideRegister : handleOpenRegister}
											>
												{openRegister ? "Login" : "Create new account"}
											</h4>
										</Box>
									</Box>
									{openRegister ? (
										<Register />
									) : (
										<form onSubmit={handleSubmit}>
											<Input
												id="email"
												type="email"
												label="Email"
												value={email}
												onChange={handleEmailChange}
												margin="normal"
												variant="outlined"
												fullWidth
												required
											/>
											<br />
											<Input
												id="password"
												type="password"
												label="Password"
												value={password}
												onChange={handlePasswordChange}
												margin="normal"
												variant="outlined"
												fullWidth
												required
											/>
											<br />
											<br />
											<Button type="submit" color="secondary" variant="contained" fullWidth>
												{translate("login")}
											</Button>
										</form>
									)}
								</Box>
							</Container>
						</motion.div>
					</AnimatePresence>
				</Grid>
				<Grid item md={7}>
					<Hidden smDown>
						<motion.div
							className={classes.sideImageContainer}
							variants={imageVariants}
							initial="hidden"
							animate="visible"
						>
							<img src={login0} alt="Logo" className={classes.sideImage} />
						</motion.div>
					</Hidden>
				</Grid>
			</Grid>
		</div>
	);
}

export default Login;
