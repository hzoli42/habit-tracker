'use client'
import { editedSessionsAtom, labelsAtom } from "@/atoms/jotai";
import NewSessionDialog from "@/components/ManagePage/NewSessionDialog";
import SessionAnalysisLineChart from "@/components/ManagePage/SessionAnalysisLineChart";
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
    const [editedSessions, setEditedSessions] = useAtom(editedSessionsAtom)
    const [data, setData] = useState<Session[]>([])

    useEffect(() => {
        if (isLoading) {
            return
        }
        setLabels(user?.sub)
        getData()
    }, [isLoading])

    function updateEditedSessions() {
        console.log(editedSessions)
        editedSessions.forEach(({ title, labels }, id) => {
            fetch(`http://0.0.0.0:5000/session/${id}`, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title,
                    labels: labels
                })
            })
        })
        setEditedSessions(new Map())
    }

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
                        let duration = "This session does not have an end time"
                        if (stop != null) {
                            const durationObject = new Date(stop.timestamp * 1000 - start.timestamp * 1000)
                            duration = `${durationObject.getUTCHours()}h ${durationObject.getUTCMinutes()}m ${durationObject.getUTCSeconds()}s`
                        }
                        return {
                            id: session.id,
                            title: session.title,
                            labels: session.labels,
                            duration: duration,
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
                        <div className="flex justify-between pt-6 pb-4">
                            <article className="prose lg:prose-xl"><h1>Sessions</h1></article>
                            <div className="flex justify-center gap-4 items-center">
                                {editedSessions.size != 0 && <Button className="bg-yellow-400 hover:bg-yellow-500" onClick={updateEditedSessions}>
                                    Save edited sessions
                                </Button>}
                                <NewSessionDialog />
                            </div>

                        </div>
                        <DataTable data={data} columns={columns} />
                    </TabsContent>
                    <TabsContent value="analysis">
                        <SessionAnalysisLineChart />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}