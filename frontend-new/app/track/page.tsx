'use client'

import { labelsAtom } from "@/atoms/jotai";
import Stopwatch from "@/components/TrackPage/Stopwatch";
import { createUserIfNew } from "@/lib/api_utils";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useAtom } from "jotai";
import { useEffect } from "react";

export default function Home() {
  const { user, error, isLoading } = useUser();
  const [labels, setLabels] = useAtom(labelsAtom)

  useEffect(() => {
    if (isLoading || user === undefined) {
      return
    }
    // createUserIfNew(user).then(() => setLabels(user?.sub))
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
