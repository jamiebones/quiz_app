/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";

const Authenticated = (props) => {
  const {
    authenticated,
    component: Component,
    path,
    exact,
    ...rest
  } = props;

  return (
    <Route
      {...rest}
      path={path}
      exact={exact}
      render={(props) => {
        if (!authenticated) {
          return <Redirect to="/login" />;
        }

        // not logged in so redirect to login page with the return url

        return <Component authenticated={authenticated} {...rest} {...props} />;
      }}
    />
  );
};

export default Authenticated;
