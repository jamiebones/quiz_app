import React from "react";
import styled from "styled-components";

const AudioComponentStyles = styled.div`
  margin-bottom: 10px;
`;

const AudioComponent = ({ src, type }) => {
  return (
    <AudioComponentStyles>
      <audio controls>
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio tag.
      </audio>
    </AudioComponentStyles>
  );
};

export default AudioComponent;
