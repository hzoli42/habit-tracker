'use client'

import { Label, labelsAtom } from "@/atoms/jotai";
import { Clock } from "@/components/TrackPage/Clock";
import { ClockInput } from "@/components/TrackPage/ClockInput";
import Stopwatch from "@/components/TrackPage/Stopwatch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LabelCombobox } from "@/components/utils/LabelCombobox";
import { TitleTextField } from "@/components/utils/TitleTextField";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Button } from "@mui/material";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

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
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const [selectedLabel, setSelectedLabel] = useState<Label | undefined>(undefined)
  const [timerExpiredDialogOpen, setTimerExpiredDialogOpen] = useState(false)

  useEffect(() => {
    if (isLoading) {
      return
    }
    if (user?.sub === null || user?.sub === undefined) {
      router.push('/')
    }
    setLabels(user?.sub)
  }, [isLoading])


  function handleTabChange(value: string) {
    if (value == "timer") {
      // setStopwatchDirection(-1)
    } else {
      // setStopwatchDirection(1)
    }
  }

  function handleTitleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setTitle(e.currentTarget.value)
  }

  function handleLabelChange(label: Label | undefined) {
    setSelectedLabel(label)
  }

  function handleStartStopToggle() {
    null
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
                  : <ClockInput />
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
              ? <Button className="bg-green-400 mt-2" variant="contained" onClick={handleStartStopToggle} fullWidth>Start</Button>
              : <Button className="bg-red-400 mt-2" variant="contained" onClick={handleStartStopToggle} fullWidth>Stop</Button>
          }
        </div>
      </div>
      <Dialog open={timerExpiredDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your timer has expired!</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => { setTimerExpiredDialogOpen(false) }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main >
  )
}
