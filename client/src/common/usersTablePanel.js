import React, { useState, useEffect } from "react";
import styled from "styled-components";
import methods from "../methods";
import Modal from "react-modal";
import { useMutation } from "@apollo/client";
import { ChangeUserPasswordMutation } from "../graphql/mutation";

Modal.setAppElement("#root");

const customStyles = {
  content: {
    width: "500px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const UsersTablePanelStyles = styled.div``;

const UsersTablePanel = ({
  users,
  changeStatusFunc,
  processing,
  currentLoginUser,
}) => {
  const [processingData, setProcessing] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(null);
  const [username, setUserName] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  //mutation here
  const [changePasswordFunction, changePasswordResult] = useMutation(
    ChangeUserPasswordMutation
  );

  useEffect(() => {
    if (changePasswordResult.data) {
      window.alert("password was changed successfully");
      setProcessing(!processingData);
      setSubmitting(!submitting);
    }

    if (changePasswordResult.error) {
      setErrors(changePasswordResult.error);
      setProcessing(!processingData);
      setSubmitting(!submitting);
    }
  }, [changePasswordResult.data, changePasswordResult.error]);

  const handlePasswordButtonClick = (username) => {
    if (username) {
      setUserName(username);
      setProcessing(!processingData);
    }
  };

  const handleStatusChange = ({ id, active }) => {
    changeStatusFunc({ id, active });
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSubmitting(!submitting);
    try {
      await changePasswordFunction({
        variables: {
          username,
          newPassword: password,
        },
      });
    } catch (error) {}
  };

  return (
    <UsersTablePanelStyles>
      <div className="table-responsive">
        <table className="table table-success table-striped">
          <thead>
            <tr>
              <th scope="col">S/N</th>
              <th scope="col">User Details</th>
              <th scope="col">Account Type</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.length > 0 &&
              users.map(({ username, id, userType, active, name }, index) => {
                return (
                  <tr key={id}>
                    <td>
                      <p>{index + 1}</p>
                    </td>

                    <td>
                      <p>Name: {name.toUpperCase()}</p>
                      <p>Username: {username.toUpperCase()}</p>
                    </td>

                    <td>
                      <p>{userType.toUpperCase()}</p>
                    </td>

                    <td>
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Action Group"
                      >
                        {methods.Utils.DisablecurrentLoginUser(
                          currentLoginUser,
                          username
                        ) === true ? null : (
                          <button
                            type="button"
                            disabled={processing}
                            className={
                              active ? "btn btn-danger" : "btn btn-success"
                            }
                            onClick={() => handleStatusChange({ id, active })}
                          >
                            {active ? "Deactivate account" : "Activate Account"}
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-warning"
                          onClick={() => handlePasswordButtonClick(username)}
                        >
                          change password
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={processingData}
        style={customStyles}
        contentLabel="Change password modal"
      >
        {errors && <p className="text-danger text-center">{errors.message}</p>}
        <form onSubmit={handlePasswordChange}>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              password
            </label>
            <input
              type="text"
              className="form-control"
              id="password"
              aria-describedby="passwordHelp"
              value={password}
              onChange={handleTextChange}
            />
            <div id="passwordHelp" className="form-text">
              Enter a new password.
            </div>
          </div>

          <div className="text-center">
            <div className="btn-group" role="group" aria-label="Action Group">
              <button
                onClick={() => setProcessing(!processingData)}
                className="btn btn-warning"
              >
                close
              </button>

              <button
                disabled={submitting}
                type="submit"
                className="btn btn-primary"
              >
                {submitting
                  ? "changing password please wait....."
                  : "Change Password"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </UsersTablePanelStyles>
  );
};

export default UsersTablePanel;
