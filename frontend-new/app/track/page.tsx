'use client'

import { Label, labelsAtom } from "@/lib/jotai";

import { TitleTextField } from "@/components/utils/TitleTextField";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import useSound from "use-sound";
import alarmSound from '../../sounds/alarm_sound.mp3';
import { postSessionNew, postSessionEventStop } from "@/lib/api_utils";
import TimerExpiredDialog from "./components/TimerExpiredDialog";
import Clock from "./components/Clock";
import StartButton from "./components/StartButton";
import StopButton from "./components/StopButton";
import LabelCombobox from "@/components/utils/LabelCombobox";

export type StopwatchTime = {
  hours: number,
  minutes: number,
  seconds: number
}

function Home() {
  const { user, error, isLoading } = useUser();
  const [labels, setLabels] = useAtom(labelsAtom)
  const router = useRouter()
  const [playAlarm, { stop }] = useSound(alarmSound, { volume: 0.5 })

  const [displayTime, setDisplayTime] = useState<StopwatchTime>({ hours: 0, minutes: 0, seconds: 0 })
  const [clockMode, setClockMode] = useState<"stopwatch" | "timer">("stopwatch")
  const [referenceTime, setReferenceTime] = useState<Date>(new Date())
  const [timerPossible, setTimerPossible] = useState(false)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const [selectedLabel, setSelectedLabel] = useState<Label | undefined>(undefined)
  const [sessionId, setSessionId] = useState<string>("")
  const [timerExpiredDialogOpen, setTimerExpiredDialogOpen] = useState(false)

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
      handleClickStopButton()
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


  function handleChangeModeClock(value: "stopwatch" | "timer") {
    setClockMode(value)
  }

  function handleChangeInputClock(clockInput: StopwatchTime) {
    setTimerPossible(clockInput.hours !== 0 || clockInput.minutes !== 0 || clockInput.seconds !== 0)
    setReferenceTime(new Date(clockInput.seconds * 1000 + clockInput.minutes * 1000 * 60 + clockInput.hours * 1000 * 60 * 60))
  }

  function handleChangeTitle(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setTitle(e.currentTarget.value)
  }

  function handleChangeLabel(label: Label | undefined) {
    setSelectedLabel(label)
  }

  async function handleClickStartButton() {
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

  async function handleClickStopButton() {
    const stopTime = new Date()
    setIsRunning(false)
    setDisplayTime({ hours: 0, minutes: 0, seconds: 0 })
    setTitle("")
    setSelectedLabel(undefined)
    await postSessionEventStop(sessionId, user?.sub, stopTime.getTime())
  }

  function handleCloseTimerExpiredDialog() {
    setTimerExpiredDialogOpen(false)
    stop()
  }

  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="md:col-span-3">
          <Clock time={displayTime} isRunning={isRunning}
            onChangeMode={handleChangeModeClock} onChangeInput={handleChangeInputClock} />
        </div>
        <div className="flex flex-col justify-end gap-4 mx-8 md:mx-0">
          <TitleTextField value={title} variant="standard" hiddenLabel placeholder="Title"
            onChange={handleChangeTitle} disabled={isRunning} />
          <LabelCombobox selectedLabel={selectedLabel} onChange={handleChangeLabel} disabled={isRunning} />
          {
            !isRunning
              ? <StartButton disabled={clockMode === "timer" && !timerPossible} onClick={handleClickStartButton} />
              : <StopButton onClick={handleClickStopButton} />
          }
        </div>
      </div>
      <TimerExpiredDialog open={timerExpiredDialogOpen} onClose={handleCloseTimerExpiredDialog} />
    </main >
  )
}

export default Home
