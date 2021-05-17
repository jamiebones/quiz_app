import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLazyQuery } from "@apollo/client";
import { LoginUser } from "../graphql/queries";
import state from "../applicationState";
import { useRecoilState } from "recoil";
import store from "store";
import Logo from "../assets/images/eruditelogo.png";
const LoginStyle = styled.div`
  .login-container {
    height: 500px;
    padding: 40px;
    border-radius: 20px;
    box-sizing: border-box;
    background-color: #ecf0f3;
    box-shadow: 14px 14px 20px #cbced1, -14px -14px 20px white;
  }
  .brand-logo {
    height: 100px;
    width: 100px;
    margin: auto;
    background: url(${Logo});
    border-radius: 50%;
    box-sizing: border-box;
    box-shadow: 7px 7px 10px #cbced1, -7px -7px 10px white;
  }
  .input {
    background: #ecf0f3;
    padding: 10px;
    padding-left: 20px;
    height: 50px;
    font-size: 14px;
    border-radius: 50px;
    box-shadow: inset 6px 6px 6px #cbced1, inset -6px -6px 6px white;
  }

  .login-button {
    border: none;
    margin-top: 20px;
    background: #1da1f2;
    height: 40px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 900;
    transition: 0.5s;
    box-shadow: 6px 6px 6px #cbced1, -6px -6px 6px white;
    width: 100%;
  }

  .login-button:hover {
    box-shadow: none;
  }
`;

const Login = (props) => {
  const [isAuth, setAuthState] = useRecoilState(state.authState);
  const [currentLoginUser, setcurrentLoginUser] = useRecoilState(
    state.currentLoginUserState
  );
  const [token, setToken] = useRecoilState(state.authToken);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    //check if the person is authenticated already
  }, []);

  const [loginUserFunction, loginUserResult] = useLazyQuery(LoginUser, {
    variables: {
      username,
      password,
    },
  });
  useEffect(() => {
    if (
      submitted &&
      loginUserResult.data &&
      loginUserResult.data.loginUser &&
      loginUserResult.called
    ) {
      const typename = loginUserResult.data.loginUser.__typename;

      if (typename === "Error") {
        const message = loginUserResult.data.loginUser.message;
        setError(message);
        setSubmitted(false);
      } else {
        //we are good here we have the baggages here
        const { id, token, username, userType, name } =
          loginUserResult.data.loginUser;
        store.set("authToken", token);
        store.set("isAuth", true);
        store.set(
          "currentLoginUser",
          JSON.stringify({ id, username, userType, name })
        );
        setAuthState(true);
        setcurrentLoginUser({ id, username, userType, name });
        setToken(token);
        setSubmitted(false);

        if (userType === "super-admin") {
          props.history.push("/dashboard");
        } else if (userType === "student") {
          props.history.push("/exam_start_page");
        }
      }
    }
    if (loginUserResult.error) {
      setSubmitted(false);
    }
  }, [loginUserResult, submitted]);

  const submitForm = (event) => {
    event.preventDefault();
    setSubmitted(true);
    loginUserFunction();
  };

  const onInputChange = (event) => {
    event.stopPropagation();
    const name = event.target.name;
    switch (name) {
      case "password":
        setPassword(event.target.value);
        break;
      case "username":
        setUsername(event.target.value);
        break;
      default:
        break;
    }
  };
  return (
    <LoginStyle>
      <div className="row justify-content-center">
        <div className="col-lg-3 col-md-6 col-sm-12">
          <p className="text-danger">{error}</p>

          <div className="login-container">
            <div className="brand-logo"></div>
            <p className="text-center lead text-info">Login</p>
            <form onSubmit={submitForm}>
              <div className="form-group">
                <label htmlFor="name">Username </label>
                <input
                  type="text"
                  className="form-control input"
                  name="username"
                  aria-describedby="username"
                  value={username}
                  onChange={onInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">password</label>
                <input
                  type="password"
                  className="form-control input"
                  id="password"
                  onChange={onInputChange}
                  name="password"
                  value={password}
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={submitted}
              >
                {submitted ? "bypassing security....." : "login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </LoginStyle>
  );
};

export default Login;
