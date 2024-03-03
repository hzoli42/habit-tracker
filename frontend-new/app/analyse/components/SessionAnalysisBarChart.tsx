'use client'
import { ResponsiveContainer, CartesianGrid, Bar, XAxis, YAxis, BarChart, Cell, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardTitle } from "../../../components/ui/card";


export default function SessionAnalysisBarChart({ title, data }: {
    title: string, data: {
        date: Date,
        duration: number,
        labelName: string,
        labelColor: string
    }[]
}) {
    function formatDate(value: number, index: number): string {
        return `${new Date(value).toDateString()}`
    }

    let labelsList: { name: string, color: string }[] = []
    data.map(x => ({ name: x.labelName, color: x.labelColor })).forEach(l => {
        if (labelsList.find(x => x.name === l.name && x.color === l.color) === undefined) {
            labelsList.push(l)
        }
    })

    let chartData: { date: number, [key: string]: number }[] = []
    data.forEach((d, i) => {
        if (chartData.find(x => x.date === d.date.getTime()) === undefined) {
            const newData: { date: number, [key: string]: number } = { date: d.date.getTime() }
            labelsList.forEach(l => newData[l.name] = 0)
            newData[d.labelName] = d.duration
            chartData.push(newData)
        } else {
            const data = chartData.find(x => x.date === d.date.getTime())
            if (!data) {
                return
            }
            data[d.labelName] += d.duration
        }
    })
    chartData.sort((a, b) => a.date - b.date)


    return (
        <div className="relative before:absolute before:flex before:justify-center before:items-center before:block before:w-full before:h-full before:bg-[#000000]/[0.15] before:content-soon  md:before:content-soon-large before:z-10">
            <Card>
                <CardContent>
                    <CardTitle className="flex justify-center pt-10 pb-4">{title}</CardTitle>
                    <ResponsiveContainer width="100%" height="100%" aspect={1.2} >
                        <BarChart data={chartData} margin={{ top: 0, right: 30, bottom: 70, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickFormatter={formatDate} angle={-90} textAnchor="end" />
                            <YAxis />
                            <Tooltip />
                            <Legend verticalAlign="top" />
                            {
                                labelsList.map((l, i) => {
                                    return (
                                        <Bar key={i} stackId="a" dataKey={l.name} fill={l.color} />
                                    )
                                })
                            }
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}