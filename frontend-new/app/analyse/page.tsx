'use client'

import { labelsAtom, userAllSessionsAtom } from "@/atoms/jotai"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Typography } from "@material-tailwind/react"
import { useAtom } from "jotai"
import { useEffect } from "react"
import BuildIcon from '@mui/icons-material/Build'
import { useRouter } from "next/navigation"
import SessionAnalysisLineChart from "@/components/StatisticsPage/SessionAnalysisLineChart"
import SessionAnalysisBarChart from "@/components/StatisticsPage/SessionAnalysisBarChart"


const dummyDataLines = [
    {
        date: new Date(1705964401000),
        duration: 8
    },
    {
        date: new Date(1705878001000),
        duration: 4
    },
    {
        date: new Date(1705791601000),
        duration: 6
    },
    {
        date: new Date(1705705201000),
        duration: 5
    },
    {
        date: new Date(1705618801000),
        duration: 5
    },
    {
        date: new Date(1705532401000),
        duration: 7
    },
    {
        date: new Date(1705446001000),
        duration: 9
    },
    {
        date: new Date(1705359601000),
        duration: 2
    }
]

const dummyDataBars = [
    {
        date: new Date(1706050801000),
        duration: 8,
        labelName: "maths",
        labelColor: "#F5E2E4"
    },
    {
        date: new Date(1706050801000),
        duration: 7,
        labelName: "physics",
        labelColor: "#DEC4D6"
    },
    {
        date: new Date(1706050801000),
        duration: 4,
        labelName: "physics",
        labelColor: "#DEC4D6"
    },
    {
        date: new Date(1705964401000),
        duration: 6,
        labelName: "history",
        labelColor: "#A9C8C0"
    },
    {
        date: new Date(1705878001000),
        duration: 5,
        labelName: "maths",
        labelColor: "#F5E2E4"
    },
    {
        date: new Date(1705791601000),
        duration: 5,
        labelName: "history",
        labelColor: "#A9C8C0"
    },
    {
        date: new Date(1705791601000),
        duration: 7,
        labelName: "maths",
        labelColor: "#F5E2E4"
    },
    {
        date: new Date(1705705201000),
        duration: 9,
        labelName: "physics",
        labelColor: "#DEC4D6"
    },
    {
        date: new Date(1705705201000),
        duration: 2,
        labelName: "maths",
        labelColor: "#F5E2E4"
    }
]


export default function Home() {
    const [userAllSessions, setUserAllSessions] = useAtom(userAllSessionsAtom)
    const [labels, setLabels] = useAtom(labelsAtom)
    const router = useRouter()

    const { user, error, isLoading } = useUser();

    useEffect(() => {
        if (isLoading) {
            return
        }
        if (user?.sub === null || user?.sub === undefined) {
            router.push('/')
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
            <div className="grid grid-cols-1 gap-8 place-items-center">
                <div className="w-full md:w-3/4">
                    <SessionAnalysisLineChart title="Total work time" data={dummyDataLines} />
                </div>
                <div className="w-full md:w-3/4">
                    <SessionAnalysisBarChart title="Total work time by label" data={dummyDataBars} />
                </div>
            </div>
        </main>
    )
}