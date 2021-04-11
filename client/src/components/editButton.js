import React from "react";
import styled from "styled-components";

const EditButtonStyles = styled.div`
  margin-left: 20px;
`;

const EditButton = ({ buttonName, action, variables, style }) => {
  return (
    <EditButtonStyles>
      <button className={`btn btn-${style}`} onClick={() => action(variables)}>
        {buttonName}
      </button>
    </EditButtonStyles>
  );
};

export default EditButton;
