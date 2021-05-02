import React from "react";
import styled from "styled-components";

const LoadableStyles = styled.div`
.loader-div{
  display: flex;
  justify-content: center;
  align-items: center;
}
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
  border: 32px solid blue;
  border-color: blue transparent blue transparent;
  animation: lds-hourglass 1.2s infinite;
}
@keyframes lds-hourglass {
  0% {
    transform: rotate(0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  50% {
    transform: rotate(900deg);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  100% {
    transform: rotate(1800deg);
  }
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
  }  else {
    return <LoadableStyles>
    <div className="row">
      <div className="col-md-12">
        <div className="loader-div">
          <div className="lds-hourglass"></div>
        </div>
      </div>
    </div>
  </LoadableStyles>;
  }
};

export default LoadableLoader;
