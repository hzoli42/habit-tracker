import { CardHeader } from "@mui/material";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { WidthFull } from "@mui/icons-material";


export default function SessionAnalysisBarChart({ title, data }: { title: string, data: { date: Date, duration: number, label: string }[] }) {
    function formatDate(value: Date, index: number): string {
        return `${value.getUTCDay()}/${value.getUTCMonth()}/${value.getUTCFullYear()}`
    }

    let dataMap = new Map<string, Map<string, number>>()
    data.forEach(x => {
        if (!dataMap.has(formatDate(x.date, 0))) {
            dataMap.set(formatDate(x.date, 0), new Map())
        }
        if (!dataMap.get(formatDate(x.date, 0))?.has(x.label)) {
            dataMap.get(formatDate(x.date, 0))?.set(x.label, x.duration)
        } else {
            const currentDuration = dataMap.get(formatDate(x.date, 0))?.get(x.label) ?? 0
            dataMap.get(formatDate(x.date, 0))?.set(x.label, currentDuration + x.duration)
        }

    })
    console.log(dataMap)

    let barChartData: { date: string, duration: number, pairs: { [key: string]: number } }[] = []
    dataMap.forEach((v, k, m) => {
        let pairs: { [key: string]: number } = {}
        let duration = 0
        v.forEach((v1, k1, m1) => {
            pairs[k1] = v1
            duration += v1
        })
        barChartData.push({ date: k, duration: duration, pairs: pairs })
    })
    let labelsList: string[] = []
    new Set(data.map(x => x.label)).forEach(l =>
        labelsList.push(l)
    )

    console.log(labelsList)
    console.log(barChartData)

    return (
        <Card>
            <CardContent>
                <CardTitle className="flex justify-center pt-10 pb-4">{title}</CardTitle>
                <ResponsiveContainer width="100%" aspect={2}>
                    <BarChart data={barChartData} margin={{ top: 0, right: 30, bottom: 70, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        {labelsList.map(l => {
                            const datakey = `pairs.${l}`
                            return < Bar stackId="pairs" dataKey={datakey} />
                        })}
                        <XAxis dataKey="date" angle={-90} textAnchor="end" />
                        <YAxis dataKey={"duration"} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}