'use client'

import { labelsAtom } from "@/atoms/jotai";
import Stopwatch from "@/components/TrackPage/Stopwatch";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useAtom } from "jotai";
import { useEffect } from "react";

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
  const { user, error, isLoading } = useUser();
  const [labels, setLabels] = useAtom(labelsAtom)

  useEffect(() => {
    if (isLoading) {
      return
    }
    setLabels(user?.sub)
  }, [isLoading])

  return (
    <main>
      <div className="container mx-auto max-w-screen-lg">
        <Stopwatch />
      </div>
    </main>
  )
}
