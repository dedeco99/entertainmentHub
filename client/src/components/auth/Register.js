import React, { useState } from "react";
import PropTypes from "prop-types";

import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import Input from "../.partials/Input";

import { register } from "../../api/auth";

function Register({ history }) {
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

		const response = await register({ email, password });

		if (response.status === 201) {
			history.push("/login");
		}
	}

	return (
		<Container maxWidth="xs">
			<form onSubmit={handleSubmit}>
				<h2>{"Register"}</h2>
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
					{"Register"}
				</Button>
			</form>
		</Container>
	);
}

Register.propTypes = {
	history: PropTypes.object.isRequired,
};

export default Register;
