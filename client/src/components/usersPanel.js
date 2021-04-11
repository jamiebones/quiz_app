import React, { useState, useEffect } from "react";
import { GetUsersByStatus } from "../graphql/queries";
import { ChangeActiveStatusOfUsers } from "../graphql/mutation";
import { useLazyQuery, useMutation } from "@apollo/client";
import UserPanelTable from "../common/usersTablePanel";
import Loading from "../common/loading";

import styled from "styled-components";

const UsersPanelStyles = styled.div``;

const buttonsToDisplay = (total, numberPerPage) => {
  const buttonNumber = +total / +numberPerPage;
  let array = [];
  array.length = Math.ceil(buttonNumber);
  return array.fill(1);
};

const UsersPanel = ({ currentLoginUser }) => {
  const [status, setStatus] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [usersArray, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [processingData, setProcessingData] = useState(false);
  const [errors, setErrors] = useState(null);
  const [usersQuery, usersQueryResult] = useLazyQuery(GetUsersByStatus, {
    variables: {
      status: status,
      offset: 0,
    },
  });

  const [statusFunction, statusFunctionResult] = useMutation(
    ChangeActiveStatusOfUsers
  );

  useEffect(() => {
    if (statusFunctionResult.data) {
      setProcessingData(false);
      setProcessing(false);
      window.alert("successfull");
    }
    if (statusFunctionResult.error) {
      setErrors(statusFunctionResult.error);
      setProcessing(false);
      setProcessingData(!processingData);
    }
  }, [statusFunctionResult.data, statusFunctionResult.error]);

  useEffect(() => {
    if (usersQueryResult.data) {
      const usersData = usersQueryResult.data.usersByStatus.users;
      const totalData = usersQueryResult.data.usersByStatus.totalUsersByStatus;
      setUsers(usersData);
      setTotalUsers(totalData);
      setProcessing(false);
    }
    if (usersQueryResult.error) {
      setErrors(usersQueryResult.error);
      setProcessing(false);
    }
  }, [usersQueryResult.data, usersQueryResult.error]);

  const getMoreUsers = (e, index) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      setProcessing(true);

      usersQueryResult.fetchMore({
        variables: {
          status: status,
          offset: usersArray.length * (index - 1),
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return Object.assign({}, prev, {
            usersByStatus: {
              totalUsersByStatus:
                fetchMoreResult.usersByStatus.totalUsersByStatus,
              __typename: "UserQueryResult",
              users: [
                //...prev.getAllQuestions.questions,
                ...fetchMoreResult.usersByStatus.users,
              ],
            },
          });
        },
      });
    } catch (error) {}
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    if (value === "0") return;
    if (value === "active") {
      setStatus(true);
    } else if (value === "inactive") {
      setStatus(false);
    }
    //call the query here
    usersQuery();
    setProcessing(!processing);
  };

  const activateDeactivateAccount = async ({ id, active }) => {
    try {
      setProcessingData(!processingData);
      await statusFunction({
        variables: {
          id,
          active,
        },
        refetchQueries: [
          {
            query: GetUsersByStatus,
            variables: {
              status: active,
              offset: 0,
            },
          },
        ],
      });
    } catch (error) {}
  };

  return (
    <UsersPanelStyles>
      <div className="row">
        <div className="col-md-6 offset-md-3 mb-3">
          <h3 className="text-center text-primary">Users Account</h3>
          {errors && (
            <p className="lead text-danger text-center"> {errors.message}</p>
          )}

          <select className="form-control" onChange={handleStatusChange}>
            <option value="0">select user account state</option>
            <option value="active">active</option>
            <option value="inactive">in active</option>
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 offset-md-2">
          {processing && (
            <div className="text-center">
              <Loading />
            </div>
          )}
          {usersArray.length > 0 && (
            <UserPanelTable
              users={usersArray}
              changeStatusFunc={activateDeactivateAccount}
              processing={processingData}
              currentLoginUser={currentLoginUser}
            />
          )}

          <nav aria-label="Page navigation example">
            <ul className="pagination">
              {totalUsers > 50 &&
                buttonsToDisplay(totalUsers, 50).map((_, index) => {
                  return (
                    <li
                      className="page-item"
                      key={index}
                      onClick={(e) => getMoreUsers(e, index + 1)}
                    >
                      <a className="page-link" href="">
                        {index + 1}
                      </a>
                    </li>
                  );
                })}
            </ul>
          </nav>
        </div>
      </div>
    </UsersPanelStyles>
  );
};

export default UsersPanel;
