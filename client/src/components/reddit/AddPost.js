import React, { Component } from "react";
import { connect } from "react-redux";
import { addPost } from "../../store/actions/redditActions";

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

const mapDispatchToProps = (dispatch) => {
	return {
		addPost: (post) => dispatch(addPost(post))
	}
}

export default connect(null, mapDispatchToProps)(AddPost);
