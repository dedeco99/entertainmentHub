import React, { Component } from "react";

import { login } from "../../actions/auth";

class Login extends Component {
	constructor() {
		super();
		this.state = {
			email: "",
			password: "",

			msg: "",
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		this.setState({ [e.target.id]: e.target.value });
	}

	async handleSubmit(e) {
		e.preventDefault();

		const { email, password } = this.state;
		const msg = await login({ email, password });

		this.setState({ msg });
	}

	render() {
		const { msg } = this.state;
		console.log(msg);
		return (
			<div className="container">
				<form className="white" onSubmit={this.handleSubmit}>
					<h5 className="grey-text text-darken-3">Sign In</h5>
					<div className="input-field">
						<label htmlFor="email">Email</label>
						<input type="email" id="email" onChange={this.handleChange} />
					</div>
					<div className="input-field">
						<label htmlFor="password">Password</label>
						<input type="password" id="password" onChange={this.handleChange} />
					</div>
					<div className="input-field">
						<button className="btn pink lighten-1 z-depth-0">Login</button>
						<div className={msg && msg.type === "error" ? "red-text center" : "green-text center"} >
							{msg ? <p>{msg.text}</p> : null}
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default Login;
