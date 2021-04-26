import React from "react";
import styled from "styled-components";

const LoadableStyles = styled.div`
  .lds-hourglass {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-hourglass:after {
    content: " ";
    display: block;
    border-radius: 50%;
    width: 0;
    height: 0;
    margin: 8px;
    box-sizing: border-box;
    border: 32px solid #fff;
    border-color: #fff transparent #fff transparent;
  }
`;

const LoadableLoader = (props) => {
  if (props.error) {
    return (
      <LoadableStyles>
        <div className="row">
          <div className="col-md-12">
            <div className="text-center">
              <div>
                <h2>Ooops! something went wrong please refresh the page</h2>
              </div>
            </div>
          </div>
        </div>
      </LoadableStyles>
    );
  } else if (props.timedOut) {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="text-center">
            <div>
              <h2>Ooops! the web page time out. Please refresh the page</h2>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (props.pastDelay) {
    return (
      <LoadableStyles>
        <div className="row">
          <div className="col-md-12">
            <div className="text-center">
              <div class="lds-hourglass"></div>
            </div>
          </div>
        </div>
      </LoadableStyles>
    );
  } else {
    return null;
  }
};

export default LoadableLoader;
