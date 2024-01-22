'use client'
import { labelsAtom } from "@/atoms/jotai";
import NewSessionDialog from "@/components/ManagePage/NewSessionDialog";
import { Session, columns } from "@/components/ManagePage/SessionsTableColumns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/utils/DataTable";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

export type SessionResponse = {
    id: string,
    title: string,
    user_id: string,
    labels: string[],
    actions: [
        {
            timestamp: number,
            event: string
        }
    ]
}

export default function Home() {
    const { user, error, isLoading } = useUser();
    const [labels, setLabels] = useAtom(labelsAtom)
    const [data, setData] = useState<Session[]>([])

    useEffect(() => {
        if (isLoading) {
            return
        }
        setLabels(user?.sub)
        getData()
    }, [isLoading])

    function getData() {
        fetch(`http://0.0.0.0:5000/session/all/${user?.sub}`, {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => response.json())
            .then(response_data => {
                setData(response_data.sessions
                    .map((session: SessionResponse) => {
                        const start = session.actions.filter(a => a.event == "start")[0]
                        const stop = session.actions.filter(a => a.event == "stop")[0]
                        const durationObject = new Date(stop.timestamp * 1000 - start.timestamp * 1000)
                        return {
                            id: session.id,
                            title: session.title,
                            labels: session.labels,
                            duration: `${durationObject.getUTCHours()}h ${durationObject.getUTCMinutes()}m ${durationObject.getUTCSeconds()}s`,
                            date: new Date(start.timestamp * 1000).toDateString()
                        }
                    })
                )
            })
    }

    return (
        <main>
            <div className="container mx-auto max-w-screen-lg">
                <Tabs defaultValue="sessions">
                    <TabsList>
                        <TabsTrigger value="sessions">Sessions</TabsTrigger>
                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sessions">
                        <article className="prose lg:prose-xl py-2"><h1>Sessions</h1></article>
                        <div className="flex justify-end">
                            <NewSessionDialog />
                        </div>
                        <DataTable data={data} columns={columns} />
                    </TabsContent>
                    <TabsContent value="analysis">
                        <div></div>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}