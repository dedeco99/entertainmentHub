import React, { Component } from "react";
import { toast } from "react-toastify";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import Input from "../.partials/Input";

import { register } from "../../actions/auth";

class Register extends Component {
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
		const response = await register({ email, password });

		if (response.status < 400) {
			window.location.replace("/login");
		} else {
			toast.error(response.message);
		}
	}

	handleKeyPress(event) {
		if (event.key === "Enter") this.handleSubmit();
	}

	render() {
		const { email, password } = this.state;

		return (
			<Container maxWidth="xs">
				<h2>{"Register"}</h2>
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
					{"Register"}
				</Button>
			</Container>
		);
	}
}

export default Register;
