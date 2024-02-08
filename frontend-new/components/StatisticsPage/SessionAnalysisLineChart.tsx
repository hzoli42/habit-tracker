'use client'
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";


export default function SessionAnalysisLineChart({ title, data }: { title: string, data: { date: Date, duration: number }[] }) {
    function formatDate(value: Date, index: number): string {
        return `${value.toDateString()}`
    }

    return (
        <div className="relative before:absolute before:flex before:justify-center before:items-center before:block before:w-full before:h-full before:bg-[#000000]/[0.15] before:content-soon  md:before:content-soon-large before:z-10">
            <Card>
                <CardContent>
                    <CardTitle className="flex justify-center pt-10 pb-4">{title}</CardTitle>
                    <ResponsiveContainer width="100%" height="100%" aspect={1.2}>
                        <LineChart data={data} margin={{ top: 0, right: 30, bottom: 70, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <Line type="monotone" dataKey="duration" stroke="#8884d8" />
                            <XAxis dataKey="date" tickFormatter={formatDate} angle={-90} textAnchor="end" />
                            <YAxis />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </ div>
    )
}