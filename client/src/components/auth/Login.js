import React, { useContext, useState } from "react";
import PropTypes from "prop-types";

import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import { UserContext } from "../../contexts/UserContext";

import Input from "../.partials/Input";

import { login } from "../../api/auth";

function Login({ history }) {
	const { dispatch } = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	function handleEmailChange(e) {
		setEmail(e.target.value);
	}

	function handlePasswordChange(e) {
		setPassword(e.target.value);
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const response = await login({ email, password });

		if (response.status < 400) {
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
				<br /><br />
				<Button
					type="submit"
					className="outlined-button"
					variant="outlined"
					fullWidth
				>
					{"Login"}
				</Button>
			</form>
		</Container>
	);
}

Login.propTypes = {
	history: PropTypes.object.isRequired,
};

export default Login;
