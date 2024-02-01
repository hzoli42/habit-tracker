'use client'

import { labelsAtom } from "@/atoms/jotai";
import { Button } from "@/components/ui/button";
import { createUserIfNew } from "@/lib/api_utils";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useAtom } from "jotai";
import { useEffect } from "react";

export default function Home() {
  const { user, error, isLoading } = useUser();
  const [labels, setLabels] = useAtom(labelsAtom)

  if (error) return <div>{error.message}</div>;

  useEffect(() => {
    if (isLoading || user === undefined) {
      return
    }
    // createUserIfNew(user).then(() => setLabels(user?.sub))
    setLabels(user?.sub)
  }, [isLoading])

  return (
    <div className="mx-auto max-w-screen-lg my-2">
      <article className="prose lg:prose-xl">
        <h1>Welcome to Habit Tracker {(user) && user.name}!</h1>
        <h3>You can use it:</h3>
        <ul className="list-disc">
          <li>As a stopwatch to track your work</li>
          <li>As a timer to track specific time windows</li>
          <li>(In the future) as a data-driven platform to optimise your work/study sessions</li>
        </ul>
        <p>To get started, register below!</p>
      </article>
      <a href="/api/auth/login?signup=true">
        <Button className="bg-blue-500 hover:bg-blue-600 my-4 w-32">Register</Button>
      </a>
    </div>
  )
}
