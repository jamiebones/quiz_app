import React, { useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import state from "../applicationState";
import client from "../apolloClient";
import { useHistory } from "react-router-dom";
import store from "store";

const CustomNavbarStyles = styled.div`
  nav {
    background: #222;
    padding: 0 15px;
  }
  a {
    color: white;
    text-decoration: none;
  }

  .menu,
  .submenu {
    list-style-type: none;
    z-index: 30000;
  }
  .logo {
    font-size: 20px;
    padding: 7.5px 10px 7.5px 0;
  }
  .item {
    padding: 10px;
    color: #fff;
  }
  .item.button {
    padding: 9px 5px;
  }
  .item:not(.button) a:hover,
  .item a:hover::after {
    color: #ccc;
  }

  /*mobile menu */

  .menu {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .menu li a {
    display: block;
    padding: 15px 5px;
  }

  .menu li.subitem a {
    padding: 15px;
    text-align: start;
  }

  .toggle {
    order: 1;
    font-size: 20px;
  }
  .item.button {
    order: 2;
  }

  .item {
    order: 3;
    width: 100%;
    text-align: center;
    display: none;
  }

  .active .item {
    display: block;
  }

  .button.secondary {
    border-bottom: 1px #444 solid;
  }

  /*submenu up for mobile screens */

  .submenu {
    display: none;
  }
  .submenu-active .submenu {
    display: block;
    cursor: pointer;
  }
  .has-submenu {
    font-size: 16px;
    color: white;
  }

  .has-submenu > a::after {
    font-family: "Font Awesome 5 Free";
    font-size: 12px;
    line-height: 16px;
    font-weight: 900;
    content: "\f078";
    color: white;
    padding-left: 5px;
  }

  .subitem a {
    padding: 10px 15px;
  }
  .submenu-active {
    background-color: #111;
    border-radius: 3px;
  }

  /* Tablet menu */

  @media all and (min-width: 700px) {
    .menu {
      justify-content: center;
    }
    .logo {
      flex: 1;
    }
    .item.button {
      width: auto;
      order: 1;
      display: block;
    }
    .toggle {
      flex: 1;
      text-align: right;
      order: 2;
    }
    /*button up from tablet screen */
    .menu li.button a {
      padding: 10px 15px;
      margin: 5px 0;
    }
    .button a {
      background: #0080ff;
      border: 1px royalblue solid;
    }
    .button.secondary a {
      background: transparent;
      border: 1px #0080ff solid;
    }
    .button a:hover {
      text-decoration: none;
    }
    .button:not(.secondary)a:hover {
      background: royalblue;
      border-color: darkblue;
    }
  }

  /*Desktop menu styles */

  @media all and (min-width: 960px) {
    .menu {
      align-items: flex-start;
      flex-wrap: nowrap;
      background: none;
    }
    .logo {
      order: 0;
    }
    .item {
      order: 1;
      display: block;
      position: relative;
      width: auto;
    }
    .button {
      order: 2;
    }
    .submenu-active .submenu {
      display: block;
      position: absolute;
      left: 0;
      top: 68px;
      background: #111;
    }
    .toggle {
      display: none;
    }
    .submenu-active {
      border-radius: 0;
    }
  }
`;

const CustomNavbar = ({ currentLoginUser, authenticated }) => {
  const [isAuth, setIsAuth] = useRecoilState(state.authState);
  const [user, setcurrentLoginUser] = useRecoilState(
    state.currentLoginUserState
  );
  const [token, setToken] = useRecoilState(state.authToken);

  let history = useHistory();

  useEffect(() => {
    const toggle = document.querySelector(".toggle");
    const menu = document.querySelector(".menu");
    const items = document.querySelectorAll(".item");

    function toggleMenu() {
      if (menu.classList.contains("active")) {
        menu.classList.remove("active");
        toggle.querySelector("a").innerHTML = "<i class='fas fa-bars'></i>";
      } else {
        menu.classList.add("active");
        toggle.querySelector("a").innerHTML = "<i class='fas fa-times'></i>";
      }
    }
    toggle.addEventListener("click", toggleMenu);

    function toggleItem() {
      if (this.classList.contains("submenu-active")) {
        this.classList.remove("submenu-active");
      } else if (menu.querySelector(".submenu-active")) {
        menu
          .querySelector(".submenu-active")
          .classList.remove("submenu-active");
        this.classList.add("submenu-active");
      } else {
        this.classList.add("submenu-active");
      }
    }

    for (let item of items) {
      if (item.querySelector(".submenu")) {
        item.addEventListener("click", toggleItem);
        item.addEventListener("keypress", toggleItem);
      }
    }

    /*Close Submenu From Anywhere */

    function closeSubmenu(e) {
      let isClickInside = menu.contains(e.target);
      if (!isClickInside && menu.querySelector(".submenu-active")) {
        menu
          .querySelector(".submenu-active")
          .classList.remove("submenu-active");
      }
    }

    document.addEventListener("click", closeSubmenu);

    return () => {
      //clean up operation here
      toggle.removeEventListener("click", toggleMenu);
      for (let item of items) {
        if (item.querySelector(".submenu")) {
          item.removeEventListener("click", toggleItem);
          item.removeEventListener("keypress", toggleItem);
        }
      }
      document.removeEventListener("click", closeSubmenu);
    };
  });

  const handleLogOut = (e) => {
    e.preventDefault();
    setIsAuth(false);
    setcurrentLoginUser({});
    setToken("");
    store.clearAll();
    client.clearStore();
    history.replace("/");
  };

  const handleLogIn = (e) => {
    e.preventDefault();
    history.push("/login");
  };

  return (
    <CustomNavbarStyles>
      <nav>
        <ul className="menu">
          <li className="logo">
            <a href="#">CBT</a>
          </li>

          {authenticated && user && user.userType == "super-admin" && (
            <li className="item" onClick={() => history.push("/dashboard")}>
              <a>Dashboard</a>
            </li>
          )}

          {authenticated && user && user.userType == "super-admin" && (
            <li className="item has-submenu">
              <a tabIndex="0">User Accounts</a>
              <ul className="submenu">
                <li
                  className="subitem"
                  onClick={() => history.push("/create_user_account")}
                >
                  <a>Create User Account</a>
                </li>

                <li className="subitem" onClick={() => history.push("/users")}>
                  <a>Users Account</a>
                </li>
              </ul>
            </li>
          )}

          {authenticated && user && user.userType == "super-admin" && (
            <li className="item has-submenu">
              <a tabIndex="0">Create Exam</a>
              <ul className="submenu">
                <li
                  className="subitem"
                  onClick={() => history.push("/create_subject")}
                >
                  <a>Create Subject</a>
                </li>
                <li
                  className="subitem"
                  onClick={() => history.push("/create_examination_schedule")}
                >
                  <a>Create Examination</a>
                </li>

                <li
                  className="subitem"
                  onClick={() => history.push("/add_questions_examination")}
                >
                  <a>Add Questions To Exam</a>
                </li>

                <li
                  className="subitem"
                  onClick={() => history.push("/activate_exams")}
                >
                  <a>Activate Exam</a>
                </li>
              </ul>
            </li>
          )}

          {authenticated && user && user.userType == "super-admin" && (
            <li className="item has-submenu">
              <a tabIndex="0">Results Functions</a>
              <ul className="submenu">
                <li
                  className="subitem"
                  onClick={() => history.push("/exam_results")}
                >
                  <a>Examination Result</a>
                </li>
              </ul>
            </li>
          )}

          {authenticated && user && user.userType == "super-admin" && (
            <li className="item has-submenu">
              <a tabIndex="0">Admin Quiz Functions</a>
              <ul className="submenu">
                <li
                  className="subitem"
                  onClick={() => history.push("/add_question")}
                >
                  <a>Add Questions</a>
                </li>

                <li
                  className="subitem"
                  onClick={() => history.push("/add_spelling_question")}
                >
                  <a>Add Spelling Questions</a>
                </li>

                <li
                  className="subitem"
                  onClick={() => history.push("/upload_questions")}
                >
                  <a>Upload Questions</a>
                </li>

                <li
                  className="subitem"
                  onClick={() => history.push("/load_multi_choice_question")}
                >
                  <a>View Multi Choice Questions</a>
                </li>

                <li
                  className="subitem"
                  onClick={() => history.push("/load_spelling_question")}
                >
                  <a>View Spelling Questions</a>
                </li>
              </ul>
            </li>
          )}

          {authenticated && user && user.userType == "super-admin" && (
            <li className="item has-submenu">
              <a tabIndex="0">Media Files</a>
              <ul className="submenu">
                <li
                  className="subitem"
                  onClick={() => history.push("/upload_media")}
                >
                  <a>Upload Media Files</a>
                </li>
              </ul>
            </li>
          )}

          {authenticated ? (
            <li className="item button" onClick={handleLogOut}>
              <a href="">Log Out</a>
            </li>
          ) : (
            <li className="item button" onClick={handleLogIn}>
              <a href="">Log In</a>
            </li>
          )}

          <li className="toggle">
            <a href="#">
              <i className="fas fa-bars"></i>
            </a>
          </li>
        </ul>
      </nav>
    </CustomNavbarStyles>
  );
};

export default CustomNavbar;
