import React, { Component } from "react";

class AddPost extends Component {
	state = {
		body:""
	}

	handleChange = (e) => {
		this.setState({
			body:e.target.value
		});
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.addPost(this.state);
		this.setState({ body: "" });
	}

	render(){
		return(
			<div>
				<form onSubmit={this.handleSubmit}>
					<label>Add</label>
					<input type="text" onChange={this.handleChange} value={this.state.body} />
				</form>
			</div>
		)
	}
}

export default AddPost;
