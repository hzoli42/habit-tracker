import SessionAnalysisBarChart from "@/components/StatisticsPage/SessionAnalysisBarChart"
import SessionAnalysisLineChart from "@/components/StatisticsPage/SessionAnalysisLineChart"


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
        label: "maths"
    },
    {
        date: new Date(1706050801000),
        duration: 7,
        label: "physics"
    },
    {
        date: new Date(1706050801000),
        duration: 4,
        label: "physics"
    },
    {
        date: new Date(1705964401000),
        duration: 6,
        label: "history"
    },
    {
        date: new Date(1705878001000),
        duration: 5,
        label: "maths"
    },
    {
        date: new Date(1705791601000),
        duration: 5,
        label: "history"
    },
    {
        date: new Date(1705791601000),
        duration: 7,
        label: "maths"
    },
    {
        date: new Date(1705705201000),
        duration: 9,
        label: "physics"
    },
    {
        date: new Date(1705705201000),
        duration: 2,
        label: "maths"
    }
]


export default function Home() {
    return (
        <main>
            <div>
                <SessionAnalysisLineChart title="Total work time" data={dummyDataLines} />
                <SessionAnalysisBarChart title="Total work time by label" data={dummyDataBars} />
            </div>
        </main>
    )
}