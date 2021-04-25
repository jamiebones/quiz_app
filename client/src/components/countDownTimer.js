import React, { useEffect, useState } from "react";
import useCountDown from "react-countdown-hook";
import styled from "styled-components";
import state from "../applicationState";
import { useRecoilValue } from "recoil";
import store from "store";

const CountDownTimerStyles = styled.div`
  
  span {
    font-size: 30px;
  }
  .timer {
    font-size: 50px;
    font-weight: bold;
    color: blue;
  }
`;

const CountDownTimer = ({ submitQuiz }) => {
  const duration = useRecoilValue(state.examDurationState);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const timerFromStore = store.get("timer");
  const time = 1000 * 60 * duration;
  const timerToUsed = time ? time : timerFromStore;

  const [timeLeft, { start }] = useCountDown(timerToUsed, 100);

  useEffect(() => {
    store.set("timer", timeLeft);
    if (timerStarted && timeLeft == 0) {
      submitQuiz();
    }
  }, [timeLeft]);

  useEffect(() => {
    start();
    setTimerStarted(true);
  }, []);

  useEffect(() => {
    secondsToTime(timeLeft);
  }, [timeRemaining, timeLeft]);

  const secondsToTime = (time) => {
    let secs = time / 1000;
    let hours = Math.floor(secs / (60 * 60));
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);
    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let padHours = hours.toString().length == 1 ? `0${hours}` : hours;
    let padMins = minutes.toString().length == 1 ? `0${minutes}` : minutes;
    let padSecs = seconds.toString().length == 1 ? `0${seconds}` : seconds;

    setTimeRemaining(`${padHours}: ${padMins} : ${padSecs}`);
  };

  return (
    <CountDownTimerStyles>
      <p className="timer">{timeRemaining}</p>
    </CountDownTimerStyles>
  );
};

export default CountDownTimer;
