import { CardHeader } from "@mui/material";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { WidthFull } from "@mui/icons-material";


export default function SessionAnalysisLineChart({ title, data }: { title: string, data: { date: Date, duration: number }[] }) {
    function formatDate(value: Date, index: number): string {
        return `${value.getDay()}/${value.getMonth()}/${value.getFullYear()}`
    }

    return (
        <Card>
            <CardContent>
                <CardTitle className="flex justify-center pt-8">{title}</CardTitle>
                <ResponsiveContainer width="100%" aspect={3}>
                    <LineChart data={data}>
                        <Line type="monotone" dataKey="duration" stroke="#8884d8" />
                        <XAxis dataKey="date" tickFormatter={formatDate} />
                        <YAxis />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}