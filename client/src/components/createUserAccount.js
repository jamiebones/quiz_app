import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { CreateNewUserAccount } from "../graphql/mutation";
import styled from "styled-components";

const CreateUserAccountStyles = styled.div``;

const CreateUserAccount = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [active, setActive] = useState(false);
  const [userType, setUserType] = useState("0");
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState(null);

  const [createUserFunction, createUserResult] = useMutation(
    CreateNewUserAccount
  );

  useEffect(() => {
    if (createUserResult.data) {
      if (createUserResult.data.createUser.__typename == "User") {
        const { name, username, userType } = createUserResult.data.createUser;
        
        setUsername("");
        setName("");
        setPassword("");
        setActive(false);
        setUserType("0");
        setErrors(null);
        window.alert(
          `The account with the details created successfully: \n Name: ${name} \n Username: ${username} \n Account Type: ${userType}`
        );
      } else {
        const errorObject = createUserResult.data.createUser;
        setErrors(errorObject);
      }
      setProcessing(false);
    }

    if (createUserResult.error) {
      setProcessing(!processing);
      setErrors(createUserResult.error);
    }
  }, [createUserResult.data, createUserResult.error]);

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case "userType":
        if (value == "0") return;
        setUserType(value);
        break;
      case "name":
        setName(value);
      case "password":
        setPassword(value);
        break;
      case "username":
        setUsername(value);
        break;
    }
  };
  const handleUserTypeChange = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setActive(true);
    } else {
      setActive(false);
    }
  };
  const submitUserFormDetails = async (e) => {
    e.preventDefault();
    if (!name) {
      return window.alert("The full name of the user is required");
    }
    if (!username) {
      return window.alert("A username for login password is required");
    }
    if (!password) {
      return window.alert(
        "Password is a required field. You cannot login without a passord."
      );
    }

    if (userType == "0") {
      return window.alert("Please select the user account type");
    }

    const userDetails = {
      username,
      name,
      password,
      userType,
      active,
    };
    //submit details here
    //confirm submission here
    const confirmDetails = window.confirm(
      `Please confirm the following details: \n\n Username: ${username} \n\n Name: ${name} \n\n Password: ${password} \n\n Account Type: ${userType} \n\n Account Active: ${active}`
    );
    if (!confirmDetails) return;
    try {
      setProcessing(!processing);
      await createUserFunction({
        variables: { ...userDetails },
      });
    } catch (error) {}
  };
  return (
    <CreateUserAccountStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h3 className="text-center text-primary">Create New User Account</h3>
          {errors && <p className="lead text-danger">{errors.message}</p>}
          <form onSubmit={submitUserFormDetails}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                aria-describedby="usernameHelp"
                onChange={handleInputChange}
                value={name}
              />
              <div id="usernameHelp" className="form-text">
                full name of the user.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                aria-describedby="usernameHelp"
                onChange={handleInputChange}
                value={username}
              />
              <div id="usernameHelp" className="form-text">
                username for login.
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="text"
                className="form-control"
                id="password"
                name="password"
                onChange={handleInputChange}
                value={password}
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="activeCheck"
                value={active}
                onChange={handleUserTypeChange}
              />
              <label className="form-check-label" htmlFor="activeCheck">
                User Active
              </label>
            </div>
            <div className="mb-3">
              <label htmlFor="userType" className="form-label">
                Account Type
              </label>
              <select
                className="form-control"
                name="userType"
                onChange={handleInputChange}
                value={userType}
              >
                <option value="0">select account type</option>
                <option value="student">student</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="mb-3 text-center">
              <button
                type="submit"
                disabled={processing}
                className="btn btn-primary btn-lg"
              >
                {!processing
                  ? "Create User Account"
                  : "Creating account. Please wait......"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </CreateUserAccountStyles>
  );
};

export default CreateUserAccount;
