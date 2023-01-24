import { useEffect, useRef, useState } from "react";
import "./App.css";

// timer state

interface TimerState {
  hours: string | undefined;
  minutes: string | undefined;
  seconds: string | undefined;
}

const getTimerInitialState = () => ({
  hours: undefined,
  minutes: undefined,
  seconds: undefined,
});

const getFormattedValue = (val: number) => {
  return val < 10 ? `0${val}` : val.toString();
};

const getHoursMinutesSeconds = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutesAndSeconds = totalSeconds % 3600;
  const minutes = Math.floor(minutesAndSeconds / 60);
  const seconds = minutesAndSeconds % 60;
  return {
    hours: getFormattedValue(hours),
    minutes: getFormattedValue(minutes),
    seconds: getFormattedValue(seconds),
  };
};

function App() {
  const [isInitialState, setIsInitialState] = useState(true);
  const [timerState, setTimerState] = useState<TimerState>(() =>
    getTimerInitialState()
  );
  const [totalSeconds, setTotalSeconds] = useState<number | undefined>(
    undefined
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<number | undefined>();

  useEffect(() => {
    if (totalSeconds !== undefined) {
      if (totalSeconds < 0) {
        resetTimer();
      } else {
        setTimerState(() => getHoursMinutesSeconds(totalSeconds));
      }
    }
  }, [totalSeconds]);

  const resetTimer = () => {
    setIsInitialState(true);
    setTimerState(() => getTimerInitialState());
    setTotalSeconds(undefined);
    clearInterval(timerRef.current);
  };

  const startTimer = () => {
    // TODO: Add validation and show message to enter values if not entered yet
    let totalSeconds = 0;
    const { seconds, minutes, hours } = timerState;
    if (hours) totalSeconds += Math.round(3600 * Number(hours));
    if (minutes) totalSeconds += Math.round(60 * Number(minutes));
    if (seconds) totalSeconds += Math.round(Number(seconds));
    setTotalSeconds(totalSeconds);
    setIsInitialState(false);
    setIsTimerRunning(true);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTotalSeconds((prev) => (prev !== undefined ? prev - 1 : undefined));
    }, 1000);
    console.log({ eerr: timerRef.current });
  };

  const pauseTimer = () => {
    console.log({ eerr: timerRef.current });
    clearInterval(timerRef.current);
    setIsTimerRunning(false);
  };

  useEffect(() => {
    if (!("Notification" in window)) {
      Notification.requestPermission().then(() => {
        console.log("requested permission");
      });
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  console.log({ totalSeconds, timerState });

  const notify = () => {
    if (!("Notification" in window)) {
      if (Notification.permission === "granted") {
        const notification = new Notification("Timer is up!");
      } else {
        Notification.requestPermission().then((permission) => {
          // If the user accepts, let's create a notification
          if (permission === "granted") {
            const notification = new Notification("Hi there!");
          }
        });
      }
    } else {
      alert("Timer is up");
    }
  };

  return (
    <div className="App">
      <h1>Countdown timer</h1>
      <input
        name="hours"
        type={"number"}
        value={timerState.hours === undefined ? "" : timerState.hours}
        placeholder={"HH"}
        disabled={!isInitialState}
        style={{ width: "50px" }}
        onChange={(e) =>
          setTimerState((prev) => ({
            ...prev,
            hours: e.target.value || undefined,
          }))
        }
      />
      <span> : </span>
      <input
        name="minutes"
        value={timerState.minutes === undefined ? "" : timerState.minutes}
        type={"number"}
        placeholder={"MM"}
        disabled={!isInitialState}
        style={{ width: "50px" }}
        onChange={(e) =>
          setTimerState((prev) => ({
            ...prev,
            minutes: e.target.value || undefined,
          }))
        }
      />
      <span> : </span>
      <input
        name="seconds"
        value={timerState.seconds === undefined ? "" : timerState.seconds}
        type={"number"}
        placeholder={"SS"}
        disabled={!isInitialState}
        style={{ width: "50px" }}
        onChange={(e) => {
          setTimerState((prev) => ({
            ...prev,
            seconds: e.target.value || undefined,
          }));
        }}
      />
      {isInitialState && <button onClick={startTimer}>Start</button>}
      {!isInitialState && (
        <>
          <button onClick={isTimerRunning ? pauseTimer : startTimer}>
            {isTimerRunning ? "Pause" : "Start"}
          </button>
          <button onClick={resetTimer}>Reset</button>
        </>
      )}
    </div>
  );
}

export default App;
