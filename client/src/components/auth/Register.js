import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

	async handleSubmit(e) {
		e.preventDefault();

		const { email, password } = this.state;
		const msg = await register({ email, password });

		toast.error(msg.text);
	}

	handleKeyPress(event) {
		if (event.key === "Enter") this.handleSubmit();
	}

	render() {
		const { email, password } = this.state;

		return (
			<Container maxWidth="xs">
				<h2>Register</h2>
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
					Register
				</Button>
				<ToastContainer
					position="bottom-right"
					newestOnTop
				/>
			</Container>
		);
	}
}

export default Register;
