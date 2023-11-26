'use client'

import Stopwatch from "@/components/SessionPage/Stopwatch";

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
        {/* <InfoCard /> */}
        <div className="grid grid-flow-row grid-cols-2 gap-4">
          <Stopwatch />
        </div>
      </div>
    </main>
  )
}
