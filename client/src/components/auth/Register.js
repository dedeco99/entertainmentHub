import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { Container, Button } from "@material-ui/core";

import Input from "../.partials/Input";

import { UserContext } from "../../contexts/UserContext";

import { register } from "../../api/auth";

function Register() {
	const history = useHistory();
	const { user } = useContext(UserContext);
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

		const response = await register({ email, password });

		if (response.status === 201) {
			history.push("/login");
		}
	}

	return (
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
				{"Register"}
			</Button>
		</form>
	);
}

export default Register;
