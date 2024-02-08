'use client'

import { labelsAtom } from "@/atoms/jotai";
import Stopwatch from "@/components/TrackPage/Stopwatch";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, error, isLoading } = useUser();
  const [labels, setLabels] = useAtom(labelsAtom)
  const router = useRouter()

  useEffect(() => {
    if (isLoading) {
      return
    }
    if (user?.sub === null || user?.sub === undefined) {
      router.push('/')
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
