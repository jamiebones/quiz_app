import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { HashLink } from "react-router-hash-link";
const NumberStyles = styled.div`
  .number-panel {
    display: flex;
    flex-wrap: wrap;
  }
  .num-div {
    width: 50px;
    height: 50px;
    padding: 20px;
    color: #fff;
    background-color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px;
  }
  .has-answered {
    background-color: green;
  }

  .sticky {
    position: fixed;
    top: 0;
    z-index: 1000;
  }
`;

const QuestionNumberDiv = ({ questionsArray = [] }) => {
  const divRef = useRef();

  const sticky = divRef && divRef.current && divRef.current.offsetTop;

  useEffect(() => {
    window.addEventListener("scroll", scrollFunction);
    return () => {
      window.removeEventListener("scroll", scrollFunction);
    };
  });

  const scrollFunction = () => {
    if (window.pageYOffset > sticky) {
      divRef && divRef.current && divRef.current.classList.add("sticky");
    } else {
      divRef && divRef.current && divRef.current.classList.remove("sticky");
    }
  };

  return (
    <NumberStyles>
      <div className="number-panel" ref={divRef}>
        {questionsArray.map(({ number, textBox: { hasAnswered } }) => {
          return (
            <React.Fragment key={number}>
              {hasAnswered == false ? (
                <HashLink to={`#${number}`} className="num-div">
                  {number}
                </HashLink>
              ) : (
                <HashLink to={`#${number}`} className="num-div has-answered">
                  {number}
                </HashLink>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </NumberStyles>
  );
};

export default QuestionNumberDiv;
