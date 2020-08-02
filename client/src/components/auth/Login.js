import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Container, Button } from "@material-ui/core";

import Input from "../.partials/Input";

import { UserContext } from "../../contexts/UserContext";

import { login } from "../../api/auth";

function Login() {
	const history = useHistory();
	const { user, dispatch } = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// eslint-disable-next-line
	useEffect(() => {
		if (user && user.token) return history.push("/");
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

	return (
		<Container maxWidth="xs">
			<form onSubmit={handleSubmit}>
				<h2>{"Login"}</h2>
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
				<Button type="submit" color="primary" variant="outlined" fullWidth>
					{"Login"}
				</Button>
			</form>
		</Container>
	);
}

export default Login;
