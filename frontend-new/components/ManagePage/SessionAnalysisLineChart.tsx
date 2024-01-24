import { CardHeader } from "@mui/material";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { WidthFull } from "@mui/icons-material";


export default function SessionAnalysisLineChart({ title, data }: { title: string, data: { date: Date, duration: number }[] }) {
    function formatDate(value: Date, index: number): string {
        return `${value.getDay()}/${value.getMonth()}/${value.getFullYear()}`
    }

    return (
        <Card>
            <CardContent>
                <CardTitle className="flex justify-center pt-10 pb-4">{title}</CardTitle>
                <ResponsiveContainer width="100%" aspect={2}>
                    <LineChart data={data} margin={{ top: 0, right: 30, bottom: 70, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="duration" stroke="#8884d8" />
                        <XAxis dataKey="date" tickFormatter={formatDate} angle={-90} textAnchor="end" />
                        <YAxis />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}