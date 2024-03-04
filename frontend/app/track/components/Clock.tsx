import { StopwatchTime } from "@/app/track/page"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

type PropsClockInput = {
    onChange: (time: StopwatchTime) => void
}

function ClockInput({ onChange }: PropsClockInput) {
    const [time, setTime] = useState<StopwatchTime>({ hours: 0, minutes: 0, seconds: 0 })
    const digitsTextClassNames = "text-clock-n-xs sm:text-clock-n-sm md:text-clock-n-md lg:text-clock-n-lg"
    const lettersTextClassNames = "text-clock-l-xs sm:text-clock-l-sm md:text-clock-l-md lg:text-clock-l-lg"
    const inputHeightClassNames = "h-clock-xs sm:h-clock-sm md:h-clock-md lg:h-clock-lg"
    const inputWidthClassNames = "w-clock-xs sm:w-clock-sm md:w-clock-md lg:w-clock-lg"

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        let newTime = time
        switch (e.currentTarget.name) {
            case "hoursInput": {
                newTime.hours = parseInt(e.currentTarget.value) || 0
                break;
            }
            case "minutesInput": {
                newTime.minutes = parseInt(e.currentTarget.value) || 0
                break;
            }
            case "secondsInput": {
                newTime.seconds = parseInt(e.currentTarget.value) || 0
                break;
            }
        }
        setTime(newTime)
        onChange(newTime)
    }

    return (
        <div className="flex justify-center items-end px-8 gap-1 pt-4 pb-8">
            <input name="hoursInput" onInput={handleInputChange}
                className={`${digitsTextClassNames} ${inputWidthClassNames} ${inputHeightClassNames} border-none placeholder-gray-500 placeholder:text-center`}
                type="text" maxLength={2} pattern="[0-9]*" placeholder="00" />
            <p className={`${lettersTextClassNames} pr-4 md:pr-8`}>h</p>
            <input name="minutesInput" onInput={handleInputChange}
                className={`${digitsTextClassNames} ${inputWidthClassNames} ${inputHeightClassNames} border-none placeholder-gray-500 placeholder:text-center`}
                type="text" maxLength={2} pattern="[0-9]*" placeholder="00" />
            <p className={`${lettersTextClassNames} pr-4 md:pr-8`}>m</p>
            <input name="secondsInput" onInput={handleInputChange}
                className={`${digitsTextClassNames} ${inputWidthClassNames} ${inputHeightClassNames} border-none placeholder-gray-500 placeholder:text-center`}
                type="text" maxLength={2} pattern="[0-9]*" placeholder="00" minLength={2} />
            <p className={`${lettersTextClassNames} pr-4 md:pr-8`}>s</p>
        </div>
    )
}

type PropsClockStatic = {
    time: StopwatchTime
    color: "active" | "inactive"
}

function ClockStatic({ time, color }: PropsClockStatic) {
    const digitsTextClassNames = "text-clock-n-xs sm:text-clock-n-sm md:text-clock-n-md lg:text-clock-n-lg"
    const lettersTextClassNames = "text-clock-l-xs sm:text-clock-l-sm md:text-clock-l-md lg:text-clock-l-lg pr-4 md:pr-8 py-4"
    const colorConfig = new Map<"active" | "inactive", string>([
        ["active", "text-black-600"],
        ["inactive", "text-gray-500"]
    ])

    function colouredDigits(digits: number) {
        const firstDigit = Math.floor(digits / 10)
        const secondDigit = digits % 10

        return (
            <>
                <p className={`${digitsTextClassNames} ${colorConfig.get(color)} px-1`}>{firstDigit}</p>
                <p className={`${digitsTextClassNames} ${colorConfig.get(color)}`}>{secondDigit}</p>
            </>
        )
    }

    return (
        <div className="flex justify-center items-end mx-8 pb-4">
            {colouredDigits(time.hours)} <p className={`${lettersTextClassNames}`}>h</p>
            {colouredDigits(time.minutes)} <p className={`${lettersTextClassNames}`}>m</p>
            {colouredDigits(time.seconds)} <p className={`${lettersTextClassNames}`}>s</p>
        </div>
    )
}

type Props = {
    time: StopwatchTime
    isRunning: boolean
    onChangeMode: (mode: "stopwatch" | "timer") => void
    onChangeInput: (time: StopwatchTime) => void
}

function Clock({ time, isRunning, onChangeMode, onChangeInput }: Props) {

    function handleChangeMode(value: string) {
        if (value === "stopwatch") {
            onChangeMode("stopwatch")
        } else {
            onChangeMode("timer")
        }
    }

    function handleChangeInput(time: StopwatchTime) {
        onChangeInput(time)
    }

    return (
        <Tabs defaultValue="stopwatch" onValueChange={handleChangeMode}>
            <TabsList>
                <TabsTrigger value="stopwatch" disabled={isRunning}>Stopwatch</TabsTrigger>
                <TabsTrigger value="timer" disabled={isRunning}>Timer</TabsTrigger>
            </TabsList>
            <TabsContent value="stopwatch">
                <ClockStatic time={time} color={isRunning ? "active" : "inactive"} />
            </TabsContent>
            <TabsContent value="timer">
                {
                    isRunning
                        ? <ClockStatic time={time} color="active" />
                        : <ClockInput onChange={handleChangeInput} />
                }

            </TabsContent>
        </Tabs>
    )
}

export default Clock