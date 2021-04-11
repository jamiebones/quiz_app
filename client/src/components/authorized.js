/* eslint-disable */
import React from "react";
import { Route, Redirect } from "react-router-dom";
import NotAuthorizedComponent from "./notAuthorizedComponent";
import store from "store";

const Authorized = (props) => {
  const {
    authenticated,
    authorizedRole,
    component: Component,
    path,
    exact,
    ...rest
  } = props;

  const currentLoginUser = store.get("currentLoginUser");
  let user;
  if (currentLoginUser) {
    user = currentLoginUser && JSON.parse(currentLoginUser);
  } else {
    //redirect the person else where
    return <Redirect to="/login" />;
  }

  return (
    <Route
      {...rest}
      path={path}
      exact={exact}
      render={(props) => {
        if (authorizedRole && authorizedRole.length > 0) {
          //check if the user belongs to the authorized role
          const { userType } = user;

          if (
            authorizedRole.indexOf(userType && userType.toLowerCase() != -1)
          ) {
            return (
              <Component
                {...props}
                currentLoginUser={currentLoginUser}
                authenticated={authenticated}
              />
            );
          } else {
            //the person is not authorized so direct them to the login page
            return <NotAuthorizedComponent {...props} />;
          }
        } else {
          return <NotAuthorizedComponent {...props} />;
        }
      }}
    />
  );
};

export default Authorized;
