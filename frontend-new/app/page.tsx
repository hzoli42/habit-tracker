'use client'

import Stopwatch from "@/components/TrackPage/Stopwatch";
import { useUser } from "@auth0/nextjs-auth0/client";



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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div className="flex items-center container mx-auto max-w-screen-lg my-2">
      <article className="prose lg:prose-xl">
        <h1>Welcome to Habit Tracker {(user) && user.name}!</h1>
        <h3>You can use it:</h3>
        <ul className="list-disc">
          <li>As a stopwatch to track your work</li>
          <li>As a timer to track specific time windows</li>
          <li>(In the future) as a data-driven platform to optimise your work/study sessions</li>
        </ul>
      </article>
    </div>
  ) 
}
