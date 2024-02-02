'use client'
import { editedLabelsAtom, editedSessionsAtom, labelsAtom, userAllSessionsAtom } from "@/atoms/jotai";
import { labelColumns } from "@/components/ManagePage/LabelsTableColumns";
import NewLabelDialog from "@/components/ManagePage/NewLabelDialog";
import NewSessionDialog from "@/components/ManagePage/NewSessionDialog";
import { sessionColumns } from "@/components/ManagePage/SessionsTableColumns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/utils/DataTable";
import { postLabelUpdate, postSessionModify } from "@/lib/api_utils";
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
    }, [isLoading])

    useEffect(() => {
        console.log("Labels atom updated - should force rerender")
    }, [labels])

    useEffect(() => {
        console.log("Sessions atom updated - should force rerender")
    }, [userAllSessions])

    useEffect(() => {
        console.log("Editedlabels atom updated - should force rerender")
    }, [editedLabels])


    function updateEditedSessions() {
        let sessionUpdates: Promise<Response>[] = []
        editedSessions.forEach(({ title, labelId }, sessionId) => {
            sessionUpdates.push(postSessionModify(sessionId, title, labelId))
        })
        Promise.all(sessionUpdates).then(() => {
            setEditedSessions(new Map())
            setUserAllSessions(user?.sub)
        })
    }

    function updateEditedLabels() {
        let labelUpdates: Promise<Response>[] = []
        editedLabels.forEach(({ name, color }, labelId) => {
            labelUpdates.push(postLabelUpdate(labelId, name, color))
        })
        Promise.all(labelUpdates).then(() => {
            setEditedLabels(new Map())
            setLabels(user?.sub)
        })
    }

    return (
        <main>
            <div className="container mx-auto max-w-screen-lg">
                <Tabs defaultValue="sessions">
                    <TabsList>
                        <TabsTrigger value="sessions">Sessions</TabsTrigger>
                        <TabsTrigger value="labels">Labels</TabsTrigger>
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
                    <TabsContent value="labels">
                        <div className="flex justify-between pt-6 pb-4">
                            <article className="prose lg:prose-xl"><h1>Labels</h1></article>
                            <div className="flex justify-center gap-4 items-center">
                                {editedLabels.size != 0 && <Button className="bg-yellow-400 hover:bg-yellow-500" onClick={updateEditedLabels}>
                                    Save edited labels
                                </Button>}
                                <NewLabelDialog />
                            </div>

                        </div>
                        <DataTable data={labels} columns={labelColumns} />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}