import React from "react";
import styled from "styled-components";

const ImageStyles = styled.div`
  margin-bottom: 10px;
  .img{
    width: 240px;
  }
`;

const ImageComponent = ({ src }) => {
  return (
    <ImageStyles>
      <img src={src} className="img" />
    </ImageStyles>
  );
};

export default ImageComponent;
