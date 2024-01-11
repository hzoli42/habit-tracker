'use client'

import Stopwatch from "@/components/TrackPage/Stopwatch";

export type StopwatchTime = {
  hours: number;
  minutes: number;
  seconds: number;
}

export type Action = {
  timestamp: number;
  stopwatch_time: StopwatchTime;
  event: string;
}

export default function Home() {
  return (
    <main>
      <div className="container mx-auto max-w-screen-lg">
          <Stopwatch />
      </div>
    </main>
  )
}
