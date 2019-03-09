import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { register } from "../../store/actions/authActions";

class Register extends Component {
  state = {
    email: "",
    password: "",
    birthday: "",
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.register(this.state);
  }

  render() {
    const { auth, authError } = this.props;
    const { from } = this.props.location.state || { from: { pathname: "/" } };

    if (auth.uid) return <Redirect to={ from } />;

    return(
      <div className="container">
        <form className="white" onSubmit={ this.handleSubmit }>
          <h5 className="grey-text text-darken-3">Sign In</h5>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" onChange={ this.handleChange } />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={ this.handleChange } />
          </div>
          <TextField
            id="birthday"
            label="Birthday"
            type="date"
            required
            InputLabelProps={{
              shrink: true,
            }}
            onChange={ this.handleChange }
          />
          <div className="input-field">
            <button className="btn pink lighten-1 z-depth-0">Login</button>
            <div className="red-text center">
              { authError ? <p>{ authError }</p> : null }
            </div>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    register: (credentials) => dispatch(register(credentials))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
