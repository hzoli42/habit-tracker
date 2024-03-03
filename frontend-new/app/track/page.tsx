'use client'

import { Label, labelsAtom } from "@/lib/jotai";
import { Clock } from "@/app/track/components/Clock";
import { ClockInput } from "@/app/track/components/ClockInput";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LabelCombobox } from "@/components/utils/LabelCombobox";
import { TitleTextField } from "@/components/utils/TitleTextField";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@mui/material";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import useSound from "use-sound";
import alarmSound from '../../sounds/alarm_sound.mp3';
import { postSessionNew, postSessionEventStop } from "@/lib/api_utils";
import Head from "next/head";

export type StopwatchTime = {
  hours: number,
  minutes: number,
  seconds: number
}

export default function Home() {
  const { user, error, isLoading } = useUser();
  const [labels, setLabels] = useAtom(labelsAtom)
  const router = useRouter()
  const [displayTime, setDisplayTime] = useState<StopwatchTime>({ hours: 0, minutes: 0, seconds: 0 })
  const [clockMode, setClockMode] = useState<"stopwatch" | "timer">("stopwatch")
  const [referenceTime, setReferenceTime] = useState<Date>(new Date())
  const [timerPossible, setTimerPossible] = useState(false)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const [selectedLabel, setSelectedLabel] = useState<Label | undefined>(undefined)
  const [sessionId, setSessionId] = useState<string>("")
  const [timerExpiredDialogOpen, setTimerExpiredDialogOpen] = useState(false)
  const [playAlarm, { stop }] = useSound(alarmSound, { volume: 0.5 })

  function timeStep() {
    let displayTimeObject: Date
    const currentTime = new Date()
    if (clockMode === "stopwatch") {
      displayTimeObject = new Date(currentTime.getTime() - referenceTime.getTime())
    } else {
      displayTimeObject = new Date(referenceTime.getTime() - currentTime.getTime())
    }
    const newDisplayTime = { hours: displayTimeObject.getUTCHours(), minutes: displayTimeObject.getUTCMinutes(), seconds: displayTimeObject.getUTCSeconds() }
    setDisplayTime(newDisplayTime)

    if (clockMode === "timer" && newDisplayTime.hours === 0 && newDisplayTime.minutes === 0 && newDisplayTime.seconds === 0) {
      handleStop()
      setTimerExpiredDialogOpen(true)
      playAlarm()
    }
  }


  useEffect(() => {
    if (isLoading) {
      return
    }
    if (user?.sub === null || user?.sub === undefined) {
      router.push('/')
    }
    setLabels(user?.sub)
  }, [isLoading])

  useEffect(() => {
    let interval: NodeJS.Timer | undefined = undefined;
    if (isRunning) {
      interval = setInterval(() => {
        timeStep();
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, displayTime]);


  function handleTabChange(value: string) {
    if (value === "stopwatch") {
      setClockMode("stopwatch")
    } else {
      setClockMode("timer")
    }
  }

  function handleClockInputChange(clockInput: StopwatchTime) {
    setTimerPossible(clockInput.hours !== 0 || clockInput.minutes !== 0 || clockInput.seconds !== 0)
    setReferenceTime(new Date(clockInput.seconds * 1000 + clockInput.minutes * 1000 * 60 + clockInput.hours * 1000 * 60 * 60))
  }

  function handleTitleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setTitle(e.currentTarget.value)
  }

  function handleLabelChange(label: Label | undefined) {
    setSelectedLabel(label)
  }

  async function handleStart() {
    const startTime = new Date()
    if (clockMode === "stopwatch") {
      setReferenceTime(startTime)
    } else {
      setReferenceTime(new Date(startTime.getTime() + referenceTime.getTime()))
    }

    setIsRunning(true)
    await postSessionNew(user?.sub, title, selectedLabel?.id, startTime.getTime())
      .then(response => response.json())
      .then(data => setSessionId(data.session_id))
  }

  async function handleStop() {
    const stopTime = new Date()
    setIsRunning(false)
    setDisplayTime({ hours: 0, minutes: 0, seconds: 0 })
    setTitle("")
    setSelectedLabel(undefined)
    await postSessionEventStop(sessionId, user?.sub, stopTime.getTime())
  }

  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="md:col-span-3">
          <Tabs defaultValue="stopwatch" onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="stopwatch" disabled={isRunning}>Stopwatch</TabsTrigger>
              <TabsTrigger value="timer" disabled={isRunning}>Timer</TabsTrigger>
            </TabsList>
            <TabsContent value="stopwatch">
              <Clock time={displayTime} color={isRunning ? "active" : "inactive"} />
            </TabsContent>
            <TabsContent value="timer">
              {
                isRunning
                  ? <Clock time={displayTime} color="active" />
                  : <ClockInput onClockInput={handleClockInputChange} />
              }

            </TabsContent>
          </Tabs>
        </div>
        <div className="flex flex-col justify-end gap-4 mx-8 md:mx-0">
          <TitleTextField value={title} variant="standard" hiddenLabel placeholder="Title"
            onChange={handleTitleChange} disabled={isRunning} />
          <LabelCombobox selectedLabel={selectedLabel} onLabelChange={handleLabelChange} disabled={isRunning} />
          {
            !isRunning
              ? <Button className="bg-green-400 mt-2" variant="contained" disabled={clockMode === "timer" && !timerPossible} onClick={() => handleStart()} fullWidth>Start</Button>
              : <Button className="bg-red-400 mt-2" variant="contained" onClick={() => handleStop()} fullWidth>Stop</Button>
          }
        </div>
      </div>
      <Dialog open={timerExpiredDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your timer has expired!</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => {
              setTimerExpiredDialogOpen(false)
              stop()
            }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main >
  )
}
