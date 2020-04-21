import React, { Component } from "react";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import Input from "../.partials/Input";

import { login } from "../../api/auth";

class Login extends Component {
	constructor() {
		super();
		this.state = {
			email: "",
			password: "",
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}

	handleChange(e) {
		this.setState({ [e.target.id]: e.target.value });
	}

	async handleSubmit() {
		const { email, password } = this.state;
		const response = await login({ email, password });

		if (response.status < 400) {
			localStorage.setItem("user", JSON.stringify(response.data.user));
			localStorage.setItem("token", response.data.token);

			window.location.replace("/");
		}
	}

	handleKeyPress(event) {
		if (event.key === "Enter") this.handleSubmit();
	}

	render() {
		const { email, password } = this.state;

		return (
			<Container maxWidth="xs">
				<h2>{"Login"}</h2>
				<Input
					id="email"
					type="email"
					label="Email"
					value={email}
					onChange={this.handleChange}
					onKeyPress={this.handleKeyPress}
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
					onChange={this.handleChange}
					onKeyPress={this.handleKeyPress}
					margin="normal"
					variant="outlined"
					fullWidth
					required
				/>
				<br /><br />
				<Button
					onClick={this.handleSubmit}
					className="outlined-button"
					variant="outlined"
					fullWidth
				>
					{"Login"}
				</Button>
			</Container>
		);
	}
}

export default Login;
