'use client'

import { labelsAtom, userAllSessionsAtom } from "@/atoms/jotai"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Typography } from "@material-tailwind/react"
import { useAtom } from "jotai"
import { useEffect } from "react"
import BuildIcon from '@mui/icons-material/Build'


// const dummyDataLines = [
//     {
//         date: new Date(1705964401000),
//         duration: 8
//     },
//     {
//         date: new Date(1705878001000),
//         duration: 4
//     },
//     {
//         date: new Date(1705791601000),
//         duration: 6
//     },
//     {
//         date: new Date(1705705201000),
//         duration: 5
//     },
//     {
//         date: new Date(1705618801000),
//         duration: 5
//     },
//     {
//         date: new Date(1705532401000),
//         duration: 7
//     },
//     {
//         date: new Date(1705446001000),
//         duration: 9
//     },
//     {
//         date: new Date(1705359601000),
//         duration: 2
//     }
// ]

// const dummyDataBars = [
//     {
//         date: new Date(1706050801000),
//         duration: 8,
//         labelName: "maths",
//         labelColor: "#000000"
//     },
//     {
//         date: new Date(1706050801000),
//         duration: 7,
//         labelName: "physics",
//         labelColor: "#000000"
//     },
//     {
//         date: new Date(1706050801000),
//         duration: 4,
//         labelName: "physics",
//         labelColor: "#6b6b6b"
//     },
//     {
//         date: new Date(1705964401000),
//         duration: 6,
//         labelName: "history",
//         labelColor: "#ffffff"
//     },
//     {
//         date: new Date(1705878001000),
//         duration: 5,
//         labelName: "maths",
//         labelColor: "#6b6b6b"
//     },
//     {
//         date: new Date(1705791601000),
//         duration: 5,
//         labelName: "history",
//         labelColor: "#6b6b6b"
//     },
//     {
//         date: new Date(1705791601000),
//         duration: 7,
//         labelName: "maths",
//         labelColor: "#ffffff"
//     },
//     {
//         date: new Date(1705705201000),
//         duration: 9,
//         labelName: "physics",
//         labelColor: "#ffffff"
//     },
//     {
//         date: new Date(1705705201000),
//         duration: 2,
//         labelName: "maths",
//         labelColor: "#6b6b6b"
//     }
// ]


export default function Home() {
    const [userAllSessions, setUserAllSessions] = useAtom(userAllSessionsAtom)
    const [labels, setLabels] = useAtom(labelsAtom)

    const { user, error, isLoading } = useUser();

    useEffect(() => {
        if (isLoading) {
            return
        }
        setUserAllSessions(user?.sub)
        setLabels(user?.sub)
    }, [isLoading])

    function getLinesData() {
        return userAllSessions.map(s => ({ date: s.start_date, duration: s.end_date.valueOf() - s.start_date.valueOf() }))
    }

    function getBarsData() {
        return userAllSessions.map(s => (
            {
                date: s.start_date,
                duration: s.end_date.valueOf() - s.start_date.valueOf(),
                labelName: labels.find(l => l.id === s.label_id)?.name ?? "Error",
                labelColor: labels.find(l => l.id === s.label_id)?.color ?? "Error"
            }
        ))
    }

    return (
        <main>
            <div>
                {/* <SessionAnalysisLineChart title="Total work time" data={getLinesData()} />
                <SessionAnalysisBarChart title="Total work time by label" data={getBarsData()} /> */}
                <Typography variant="h2" className="flex justify-center gap-4 p-8 items-center text-gray-500">
                    <BuildIcon />
                    Content coming soon!
                </Typography>
            </div>
        </main>
    )
}