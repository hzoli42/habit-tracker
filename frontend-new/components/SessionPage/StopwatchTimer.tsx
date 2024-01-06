'use client'
import { StopwatchTime } from "@/app/page";
import { Typography } from "@mui/material";
import { useState } from "react";
import Image from "next/image"

export type StopwatchTimerProps = {
    time: StopwatchTime
}

// type StopWatchDigitProps = {
//     digit: number
// }

// function StopwatchDigit({digit}: StopWatchDigitProps) {
//     return (
//         <div className="flex flex-col items-center">
//             <div>
//                 <Image
//                     src="/up-arrow.png"
//                     width={40}
//                     height={40} 
//                     alt="increment"
//                 />
//             </div>
//             <p className="font-mono text-[100px] p-0 m-0">{digit}</p>
//             <div>
//                 <Image
//                     src="/down-arrow.png" 
//                     width={40}
//                     height={40} 
//                     alt="decrement"
//                 />
//             </div>
//         </div>
//     )
// }

export default function StopwatchTimer({time} : StopwatchTimerProps) {
    return (
        // <div className="flex items-center justify-center px-8 grid grid-cols-8 gap-0">
        //     <StopwatchDigit digit={time.hours / 10}/>
        //     <StopwatchDigit digit={time.hours % 10}/>
        //     <div className="flex justify-center"><p className="font-mono text-[100px]"> : </p></div>
        //     <StopwatchDigit digit={time.minutes / 10}/>
        //     <StopwatchDigit digit={time.minutes % 10}/>
        //     <div className="flex justify-center"><p className="font-mono text-[100px]"> : </p></div>
        //     <StopwatchDigit digit={time.seconds / 10}/>
        //     <StopwatchDigit digit={time.seconds % 10}/>
        // </div>
        <>
        </>
    )
}