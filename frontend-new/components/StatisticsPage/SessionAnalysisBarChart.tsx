'use client'
import { ResponsiveContainer, CartesianGrid, Bar, XAxis, YAxis, BarChart, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";


export default function SessionAnalysisBarChart({ title, data }: {
    title: string, data: {
        date: Date,
        duration: number,
        labelName: string,
        labelColor: string
    }[]
}) {
    function formatDate(value: Date, index: number): string {
        return `${value.toDateString()}`
    }

    let dataMap = new Map<string, Map<string, { duration: number, color: string }>>()
    data.forEach(x => {
        if (!dataMap.has(formatDate(x.date, 0))) {
            dataMap.set(formatDate(x.date, 0), new Map())
        }
        if (!dataMap.get(formatDate(x.date, 0))?.has(x.labelName)) {
            dataMap.get(formatDate(x.date, 0))?.set(x.labelName, { duration: x.duration, color: x.labelColor })
        } else {
            const currentDuration = dataMap.get(formatDate(x.date, 0))?.get(x.labelName)?.duration ?? 0
            dataMap.get(formatDate(x.date, 0))?.set(x.labelName, { duration: currentDuration + x.duration, color: x.labelColor })
        }

    })

    let barChartData: { date: string, duration: number, pairs: { [key: string]: { duration: number, color: string } } }[] = []
    dataMap.forEach((v, k, m) => {
        let pairs: { [key: string]: { duration: number, color: string } } = {}
        let duration = 0
        v.forEach((v1, k1, m1) => {
            pairs[k1] = v1
            duration += v1.duration
        })
        barChartData.push({ date: k, duration: duration, pairs: pairs })
    })
    let labelsList: string[] = []
    new Set(data.map(x => x.labelName)).forEach(l =>
        labelsList.push(l)
    )

    return (
        <Card>
            <CardContent>
                <CardTitle className="flex justify-center pt-10 pb-4">{title}</CardTitle>
                <ResponsiveContainer width="100%" aspect={2}>
                    <BarChart data={barChartData} margin={{ top: 0, right: 30, bottom: 70, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        {
                            labelsList.map(l => {
                                const datakey = `pairs.${l}.duration`
                                return (
                                    < Bar stackId="pairs" dataKey={datakey}>
                                        {
                                            barChartData.map(d => {
                                                if (d.pairs[l] == null) {
                                                    return
                                                }
                                                return (
                                                    <Cell fill={d.pairs[l].color} />
                                                )
                                            })
                                        }
                                    </Bar>
                                )
                            })
                        }
                        <XAxis dataKey="date" angle={-90} textAnchor="end" />
                        <YAxis dataKey={"duration"} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}