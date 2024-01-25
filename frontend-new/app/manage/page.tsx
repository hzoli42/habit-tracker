'use client'
import { LabelData, editedSessionsAtom, labelsAtom, userAllSessionsAtom } from "@/atoms/jotai";
import NewSessionDialog from "@/components/ManagePage/NewSessionDialog";
import SessionAnalysisBarChart from "@/components/ManagePage/SessionAnalysisBarChart";
import SessionAnalysisLineChart from "@/components/ManagePage/SessionAnalysisLineChart";
import { Session, columns } from "@/components/ManagePage/SessionsTableColumns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/utils/DataTable";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

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
    const { user, error, isLoading } = useUser();
    const [labels, setLabels] = useAtom(labelsAtom)
    const [editedSessions, setEditedSessions] = useAtom(editedSessionsAtom)
    const [userAllSessions, setUserAllSessions] = useAtom(userAllSessionsAtom)

    useEffect(() => {
        if (isLoading) {
            return
        }
        setLabels(user?.sub)
        setUserAllSessions(user?.sub)
        console.log(userAllSessions)
    }, [isLoading])

    function updateEditedSessions() {
        console.log(editedSessions)
        editedSessions.forEach(({ title, label }, id) => {
            fetch(`http://0.0.0.0:5000/session/${id}`, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title,
                    label: label
                })
            })
        })
        setEditedSessions(new Map())
        setUserAllSessions(user?.sub)
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
                        <DataTable data={userAllSessions} columns={columns} />
                    </TabsContent>
                    <TabsContent value="analysis">
                        <SessionAnalysisLineChart title="Total work time" data={dummyDataLines} />
                        <SessionAnalysisBarChart title="Total work time by label" data={dummyDataBars} />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}