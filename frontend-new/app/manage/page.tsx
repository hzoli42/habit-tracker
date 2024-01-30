'use client'
import { LabelData, editedLabelsAtom, editedSessionsAtom, labelsAtom, userAllSessionsAtom } from "@/atoms/jotai";
import { labelColumns } from "@/components/ManagePage/LabelsTableColumns";
import NewSessionDialog from "@/components/ManagePage/NewSessionDialog";
import { sessionColumns } from "@/components/ManagePage/SessionsTableColumns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/utils/DataTable";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";


export default function Home() {
    const { user, error, isLoading } = useUser();
    const [labels, setLabels] = useAtom(labelsAtom)
    const [editedSessions, setEditedSessions] = useAtom(editedSessionsAtom)
    const [editedLabels, setEditedLabels] = useAtom(editedLabelsAtom)
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
        editedSessions.forEach(({ title, label_id }, id) => {
            fetch(`${process.env.NEXT_PUBLIC_API_BASE}/session/${id}`, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title,
                    label_id: label_id
                })
            })
        })
        setEditedSessions(new Map())
        setUserAllSessions(user?.sub)
    }

    function updateEditedLabels() {
        console.log(labels)
        let newLabelsData: LabelData[] = []
        labels.forEach(l => {
            if (editedLabels.has(l.id)) {
                const editedLabelData = editedLabels.get(l.id)
                newLabelsData.push({
                    id: l.id,
                    labelName: editedLabelData?.name ?? "Error",
                    labelColor: editedLabelData?.color ?? "#000000"
                })
            } else {
                newLabelsData.push(l)
            }
        })

        fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user/${user?.sub}/labels`, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                labels: newLabelsData
            })
        })

        setEditedLabels(new Map())
        setLabels(user?.sub)
    }

    return (
        <main>
            <div className="container mx-auto max-w-screen-lg">
                <Tabs defaultValue="sessions">
                    <TabsList>
                        <TabsTrigger value="sessions">Sessions</TabsTrigger>
                        <TabsTrigger value="analysis">Labels</TabsTrigger>
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
                        <DataTable data={userAllSessions} columns={sessionColumns} />
                    </TabsContent>
                    <TabsContent value="analysis">
                        <div className="flex justify-between pt-6 pb-4">
                            <article className="prose lg:prose-xl"><h1>Sessions</h1></article>
                            <div className="flex justify-center gap-4 items-center">
                                {editedLabels.size != 0 && <Button className="bg-yellow-400 hover:bg-yellow-500" onClick={updateEditedLabels}>
                                    Save edited labels
                                </Button>}
                                <NewSessionDialog />
                            </div>

                        </div>
                        <DataTable data={labels} columns={labelColumns} />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}