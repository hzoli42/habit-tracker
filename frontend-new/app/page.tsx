'use client'
import Stopwatch from "@/components/TrackPage/StopwatchButtons";
import TrackPageCard from "@/components/TrackPage/InfoCard";
import { Input } from "@/components/ui/input";
import InfoCard from "@/components/TrackPage/InfoCard";
import StopwatchTimer from "@/components/TrackPage/StopwatchTimer";
import StopwatchButtons from "@/components/TrackPage/StopwatchButtons";
import StopwatchActions from "@/components/TrackPage/StopwatchActions";

export type StopwatchTime = {
  hours: number;
  minutes: number;
  seconds: number;
}

export type Action = {
  timestamp: number;
  stopwatch_time: StopwatchTime;
  action: string;
}

export default function Home() {
  return (
    <main>
      <div className="container mx-auto max-w-screen-lg">
        {/* <InfoCard /> */}
        <div className="grid grid-flow-row grid-cols-2 gap-4">
          <div>
            <StopwatchTimer />
            <StopwatchButtons />    
          </div>
          <div>
            <StopwatchActions />
          </div>  
        </div>
      </div>
    </main>
  )
}
