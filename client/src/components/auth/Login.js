import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles, Grid, Button, Container, Box, Hidden } from "@material-ui/core";

import Input from "../.partials/Input";
import Register from "./Register";

import { UserContext } from "../../contexts/UserContext";

import { login } from "../../api/auth";

import logo from "../../img/logo_big.png";

import login0 from "../../img/login/login_0.png";

const styles = {
	root: {
		width: "100%",
		height: "100%",
		top: 0,
		left: 0,
		position: "absolute",
		overflow: "hidden",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	container: {
		minWidth: 400,
	},
	formContainer: {
		padding: 20,
	},
	sideImageContainer: {
		height: "100%",
		maxWidth: "60%",
		top: 0,
		right: 0,
		position: "absolute",
		zIndex: -1,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	sideImage: {
		maxHeight: "100%",
		width: "100%",
		filter: "brightness(50%) sepia(70%) hue-rotate(-35deg) saturate(500%)",
	},
	createAccount: {
		cursor: "pointer",
		"&:hover": {
			textDecoration: "underline",
		},
	},
};

const useStyles = makeStyles(styles);

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
										{"Continue to EntertainmentHub"}
									</Button>
								</form>
							)}
						</Box>
					</Container>
				</Grid>
				<Grid item md={7}>
					<Hidden smDown>
						<div className={classes.sideImageContainer}>
							<img src={login0} alt="Logo" className={classes.sideImage} />
						</div>
					</Hidden>
				</Grid>
			</Grid>
		</div>
	);
}

export default Login;
