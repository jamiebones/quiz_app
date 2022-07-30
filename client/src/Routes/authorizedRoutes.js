/* eslint-disable */
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context";

const checkAuthorization = (authorizedRole, user) => {
  
  if (authorizedRole && authorizedRole.length > 0) {
    //check if the user belongs to the authorized role
    const userType  = user?.userType;
    if (authorizedRole.indexOf(userType && userType.toLowerCase() != -1)) {
      return true;
    }
  }
  return false;
};

export const AuthorizedRoutes = ({ authorizedRole }) => {
  const { currentLoginUser } = useAuth();
  const navigate = useNavigate();
  if (!currentLoginUser) {
    //redirect the person else where
    navigate("/login");
  }

  return (
    <>
      {checkAuthorization(authorizedRole, currentLoginUser) ? (
        <Outlet />
      ) : (
        navigate("/login")
      )}
      ;
    </>
  );
};
