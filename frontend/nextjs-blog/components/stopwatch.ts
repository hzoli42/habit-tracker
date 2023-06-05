import { useState } from "react";

type Time = {
    hours: number;
    minutes: number;
    seconds: number;
}

export default function Stopwatch() {
    const [time, setTime] = useState<Time>({hours: 0, minutes: 0, seconds: 0})
};