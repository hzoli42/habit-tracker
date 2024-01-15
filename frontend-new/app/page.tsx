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

  console.log(process.env.AUTH0_SECRET)
  console.log(process.env.AUTH0_BASE_URL)
  console.log(process.env.AUTH0_ISSUER_BASE_URL)
  console.log(process.env.AUTH0_CLIENT_ID)
  console.log(process.env.AUTH0_SECRET_ID)

  if (user) {
    return (
      <div>
        Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
      </div>
    );
  }

  return (
    <>
      <a href="/api/auth/login">Login</a>;
      <a href="/api/auth/logout">Logout</a>;
    </>
  ) 
  
  // return (
  //   <main>
  //     <div className="container mx-auto max-w-screen-lg">
  //         <h1>Welcome to Habit Tracker</h1>
  //     </div>
  //   </main>
  // )
}
