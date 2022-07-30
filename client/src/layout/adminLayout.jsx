import React from "react";
import { Link, Outlet } from "react-router-dom";

export const AdminLayout = () => {
  return (
    <>
      <div className="row">
        <div className="col-md-4"></div>

        <div className="col-md-8">
          <Outlet />
        </div>
      </div>
    </>
  );
};
