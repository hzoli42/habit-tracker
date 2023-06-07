import { useState, useEffect } from "react";
import styles from "../styles/Timer.module.css";
import classnames from "classnames";

type Time = {
    hours: number;
    minutes: number;
    seconds: number;
}

export default function Stopwatch() {
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState<Time>({hours: 0, minutes: 0, seconds: 0});

    function incrementSecond() {
        const [secondsDiv, secondsMod] = [Math.floor((time.seconds + 1) / 60), (time.seconds + 1) % 60];
        const [minutesDiv, minutesMod] = [Math.floor((time.minutes + secondsDiv) / 60), (time.minutes + secondsDiv) % 60];
        const hoursMod = (time.hours + minutesDiv) % 24;
        setTime({hours: hoursMod, minutes: minutesMod, seconds: secondsMod});
    }

    function toggle() {
        setIsActive(!isActive);
    }
    
    function reset() {
        setIsActive(false);
        setTime({hours: 0, minutes: 0, seconds: 0});
    }

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                incrementSecond();
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, time]);
    return (
        <div className={styles.app}>
            <div className={styles.time}>
                {time.hours}h : {time.minutes}m : {time.seconds}s
            </div>
            <div className={styles.row}>
                <button className={`${styles.button} ${styles["button-primary"]} ${styles["button-primary-active"]}`} onClick={toggle}>
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button className={styles.button} onClick={reset}>
                    Reset
                </button>
            </div>
        </div>
    );
};

// import React, { useState, useEffect } from 'react';

// const Timer = () => {
//   const [seconds, setSeconds] = useState(0);
//   const [isActive, setIsActive] = useState(false);

//   function toggle() {
//     setIsActive(!isActive);
//   }

//   function reset() {
//     setSeconds(0);
//     setIsActive(false);
//   }

//   useEffect(() => {
//     let interval = null;
//     if (isActive) {
//       interval = setInterval(() => {
//         setSeconds(seconds => seconds + 1);
//       }, 1000);
//     } else if (!isActive && seconds !== 0) {
//       clearInterval(interval);
//     }
//     return () => clearInterval(interval);
//   }, [isActive, seconds]);

//   return (
//     <div className="app">
//       <div className="time">
//         {seconds}s
//       </div>
//       <div className="row">
//         <button className={`button button-primary button-primary-${isActive ? 'active' : 'inactive'}`} onClick={toggle}>
//           {isActive ? 'Pause' : 'Start'}
//         </button>
//         <button className="button" onClick={reset}>
//           Reset
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Timer;