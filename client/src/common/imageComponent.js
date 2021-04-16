import React from "react";
import styled from "styled-components";

const ImageStyles = styled.div`
  margin-bottom: 10px;
`;

const ImageComponent = ({ src }) => {
  return (
    <ImageStyles>
      <img src={src} />
    </ImageStyles>
  );
};

export default ImageComponent;
