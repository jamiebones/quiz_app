import React, { useEffect } from "react";
import Countdown, { zeroPad } from "react-countdown";
import styled from "styled-components";
import store from "store";

const CountDownTimerStyles = styled.div`
  text-align: center;
  span {
    font-size: 30px;
  }
`;

const CountDownTimer = ({ time }) => {
  const timerValue = store.get("timer");
  console.log("timer value is ", timerValue);
  const value = timerValue ? timerValue : 600000
  useEffect(() => {
    
    const timer = store.get("timer");
    console.log("this is ",timer)
  });
  const onTick = ({ minutes, hours, seconds }) => {
    //debugger;
    console.log(`${hours} hours : ${minutes} minutes : seconds: ${seconds}`);
    store.set("timer", hours * 60 + minutes * 60 + seconds);
  };
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (!completed) {
    }

    if (completed) {
      // Render a completed state
      // alert("hello from space bitches");
      //click the submit button here
      return null;
    } else {
      // Render a countdown
      return (
        <span>
          {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      );
    }
  };

  return (
    <CountDownTimerStyles>
      <Countdown
        date={Date.now() + value }
        intervalDelay={0}
        precision={3}
        renderer={renderer}
        onTick={onTick}
      />
    </CountDownTimerStyles>
  );
};

export default CountDownTimer;
