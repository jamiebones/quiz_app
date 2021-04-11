import React from "react";
import styled from "styled-components";

const ErrorDisplayStyles = styled.div`
  .lead {
    font-size: 20px;
  }
`;

const ErrorDisplay = ({ errors }) => {
  if (errors && errors.length > 0) {
    return (
      <ErrorDisplayStyles>
        {errors.map(({ message }, i) => {
          return (
            <p key={i} className="lead text-danger">
              {message}
            </p>
          );
        })}
      </ErrorDisplayStyles>
    );
  }

  return null;
};

export default ErrorDisplay;
