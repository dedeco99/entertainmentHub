import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";

const PrivateRoute = ({component: Component, ...rest }) => {
  const { auth } = rest;

  return (
    <Route
      {...rest}
      render={props => {
        if(auth.uid){
        	return <Component {...props} />;
				}else{
	        return <Redirect to={{pathname: "/login", state: { from: props.location }}} />;
				}
      }}
    />
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}

export default compose(
  connect(mapStateToProps)
)(PrivateRoute);
