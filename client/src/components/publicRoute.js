import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ authenticated, component, path, exact, ...rest }) => (
    
  <Route
    path={path}
    exact={exact}
    render={(props) =>
      !authenticated ? (
        React.createElement(component, {
          ...props,
          ...rest,
          authenticated,
        })
      ) : (
        <Redirect to={"/"} authenticated={authenticated} {...props}/>
      )
    }
  />
);

export default PublicRoute;
