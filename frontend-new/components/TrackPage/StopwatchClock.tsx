import { Dispatch, SetStateAction } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { StopwatchTime } from "./Stopwatch";

export type StopwatchTimerProps = {
    time: StopwatchTime,
    setTime: Dispatch<SetStateAction<StopwatchTime>>;
    setStopwatchDirection: Dispatch<SetStateAction<number>>;
    isRunning: boolean
}

export enum StopwatchMode {
    Stopwatch,
    Timer
}

export default function StopwatchClock({ time, setTime, setStopwatchDirection, isRunning }: StopwatchTimerProps) {
    const digitsTextClassNames = "text-clock-n-xs sm:text-clock-n-sm md:text-clock-n-md lg:text-clock-n-lg"
    const lettersTextClassNames = "text-clock-l-xs sm:text-clock-l-sm md:text-clock-l-md lg:text-clock-l-lg"
    const inputHeightClassNames = "h-clock-xs sm:h-clock-sm md:h-clock-md lg:h-clock-lg"
    const inputWidthClassNames = "w-clock-xs sm:w-clock-sm md:w-clock-md lg:w-clock-lg"

    function colouredDigits(digits: number) {
        const firstDigit = Math.floor(digits / 10)
        const secondDigit = digits % 10



        return (
            <>
                {
                    firstDigit == 0 && !isRunning
                        ? <p className={`${digitsTextClassNames} text-gray-500 px-1`}>{firstDigit}</p>
                        : <p className={`${digitsTextClassNames} text-black-600 px-1`}>{firstDigit}</p>
                }
                {
                    secondDigit == 0 && !isRunning
                        ? <p className={`${digitsTextClassNames} text-gray-500 px-1`}>{secondDigit}</p>
                        : <p className={`${digitsTextClassNames} text-black-600 px-1`}>{secondDigit}</p>
                }
            </>
        )
    }

    function handleTabChange(value: string) {
        if (value == "timer") {
            setStopwatchDirection(-1)
        } else {
            setStopwatchDirection(1)
        }
    }

    // TODO: handle incorrect values, like >24 for hours >59 for minutes and seconds
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        switch (e.currentTarget.name) {
            case "hoursInput": {
                setTime({ hours: parseInt(e.currentTarget.value), minutes: time.minutes, seconds: time.seconds });
                break;
            }
            case "minutesInput": {
                setTime({ hours: time.hours, minutes: parseInt(e.currentTarget.value), seconds: time.seconds });
                break;
            }
            case "secondsInput": {
                setTime({ hours: time.hours, minutes: time.minutes, seconds: parseInt(e.currentTarget.value) });
                break;
            }
        }
    }

    return (
        <Tabs defaultValue="stopwatch" onValueChange={handleTabChange}>
            <TabsList>
                <TabsTrigger value="stopwatch" disabled={isRunning}>Stopwatch</TabsTrigger>
                <TabsTrigger value="timer" disabled={isRunning}>Timer</TabsTrigger>
            </TabsList>
            <TabsContent value="stopwatch">
                <div className="flex justify-center items-end px-8 pb-4">
                    {colouredDigits(time.hours)} <p className={`${lettersTextClassNames} pr-8 py-4`}>h</p>
                    {colouredDigits(time.minutes)} <p className={`${lettersTextClassNames} pr-8 py-4`}>m </p>
                    {colouredDigits(time.seconds)} <p className={`${lettersTextClassNames} pr-8 py-4`}>s </p>
                </div>
            </TabsContent>
            <TabsContent value="timer">
                {
                    !isRunning
                        ? <div className="flex justify-center items-end px-8 gap-1 pt-4 pb-8">
                            <input name="hoursInput" onChange={handleInputChange}
                                className={`${digitsTextClassNames} ${inputWidthClassNames} ${inputHeightClassNames} border-none placeholder-gray-500 placeholder:text-center`}
                                type="text" maxLength={2} pattern="[0-9]*" placeholder="00" />
                            <p className={`${lettersTextClassNames} pr-8`}>h</p>
                            <input name="minutesInput" onChange={handleInputChange}
                                className={`${digitsTextClassNames} ${inputWidthClassNames} ${inputHeightClassNames} border-none placeholder-gray-500 placeholder:text-center`}
                                type="text" maxLength={2} pattern="[0-9]*" placeholder="00" />
                            <p className={`${lettersTextClassNames} pr-8`}>m</p>
                            <input name="secondsInput" onChange={handleInputChange}
                                className={`${digitsTextClassNames} ${inputWidthClassNames} ${inputHeightClassNames} border-none placeholder-gray-500 placeholder:text-center`}
                                type="text" maxLength={2} pattern="[0-9]*" placeholder="00" />
                            <p className={`${lettersTextClassNames} pr-8`}>s</p>
                        </div>
                        : <div className="flex justify-center items-end px-8 pb-4">
                            {colouredDigits(time.hours)} <p className={`${lettersTextClassNames} pr-8 py-4`}>h</p>
                            {colouredDigits(time.minutes)} <p className={`${lettersTextClassNames} pr-8 py-4`}>m </p>
                            {colouredDigits(time.seconds)} <p className={`${lettersTextClassNames} pr-8 py-4`}>s </p>
                        </div>
                }
            </TabsContent>
        </Tabs>
    )
}