import React from 'react';
import { Route, Redirect } from 'react-router-dom';
//import auth from "./auth";

const PrivateRoute = ({component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if(true /*auth.isAuthenticated()*/){
        	return <Component {...props} />;
				}else{
	        return <Redirect to={{pathname: "/login", state: { from: props.location }}} />;
				}
      }}
    />
  )
}

export default PrivateRoute;
