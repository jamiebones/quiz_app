import React from "react";
import styled from "styled-components";

const VideoComponentStyle = styled.div`
    margin-bottom: 10px;
`;

const VideoComponent = ({ src, type }) => {
  return (
    <VideoComponentStyle>
      <video width="320" height="240" controls>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </VideoComponentStyle>
  );
};

export default VideoComponent;
