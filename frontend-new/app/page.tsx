'use client'

import { labelsAtom } from "@/atoms/jotai";
import { Button } from "@/components/ui/button";
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
    <article className="prose">
      <h1 className="pt-8">Welcome to Habit Tracker {(user) && user.name}!</h1>
      <h3>You can use it:</h3>
      <ul className="list-disc">
        <li>As a stopwatch to track your work</li>
        <li>As a timer to track specific time windows</li>
        <li>(In the future) as a data-driven platform to optimise your work/study sessions</li>
      </ul>
      <p><b>Log in</b> or <b>sign up</b> to get started!</p>
    </article>
  )
}
