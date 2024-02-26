'use client'
import { Label, Session, editedLabelsAtom, editedSessionsAtom, labelsAtom, userAllSessionsAtom } from "@/atoms/jotai";
import { BulkActions } from "@/components/ManagePage/BulkActions";
import { labelColumns } from "@/components/ManagePage/LabelsTableColumns";
import NewLabelDialog from "@/components/ManagePage/NewLabelDialog";
import NewSessionDialog from "@/components/ManagePage/NewSessionDialog";
import { SaveButton } from "@/components/ManagePage/SaveButton";
import { sessionColumns } from "@/components/ManagePage/SessionsTableColumns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/utils/DataTable";
import { deleteSessionById, postLabelUpdate, postSessionUpdate } from "@/lib/api_utils";
import { useUser } from "@auth0/nextjs-auth0/client";
import { RowSelection, RowSelectionState, TableState, Updater, functionalUpdate } from "@tanstack/react-table";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Home() {
    const { user, error, isLoading } = useUser();
    const [labels, setLabels] = useAtom(labelsAtom)
    const [editedSessions, setEditedSessions] = useAtom(editedSessionsAtom)
    const [editedLabels, setEditedLabels] = useAtom(editedLabelsAtom)
    const [userAllSessions, setUserAllSessions] = useAtom(userAllSessionsAtom)
    const [selectedSessionRows, setSelectedSessionRows] = useState<RowSelectionState>({})
    const router = useRouter()


    useEffect(() => {
        if (isLoading) {
            return
        }
        if (user?.sub === null || user?.sub === undefined) {
            router.push('/')
        }
        setLabels(user?.sub)
        setUserAllSessions(user?.sub)
        setEditedLabels(new Map())
        setEditedSessions(new Map())
    }, [isLoading])

    useEffect(() => {
        setEditedLabels(new Map())
        setSelectedSessionRows({})
    }, [labels])

    useEffect(() => {
        setEditedSessions(new Map())
        setSelectedSessionRows({})
    }, [userAllSessions])

    useEffect(() => {
        console.log(`Edited sessions size: ${editedSessions.size}`)
        console.log(editedLabels.size)
    }, [editedSessions, editedLabels])



    function updateEditedSessions() {
        let sessionUpdates: Promise<Response>[] = []
        editedSessions.forEach(({ title, labelId }, sessionId) => {
            sessionUpdates.push(postSessionUpdate(sessionId, user?.sub, title, labelId ?? ""))
        })
        Promise.all(sessionUpdates).then(() => {
            setUserAllSessions(user?.sub)
        })
    }

    function updateEditedLabels() {
        let labelUpdates: Promise<Response>[] = []
        editedLabels.forEach(({ name, color }, labelId) => {
            labelUpdates.push(postLabelUpdate(labelId, user?.sub, name, color))
        })
        Promise.all(labelUpdates).then(() => {
            setLabels(user?.sub)
        })
    }

    async function deleteSelectedSessions() {
        let selectedSessions: Session[] = []
        Object.keys(selectedSessionRows).forEach(x => selectedSessions.push(userAllSessions[parseInt(x)]))

        let sessionDeletes: Promise<Response>[] = []
        selectedSessions.forEach(s => {
            sessionDeletes.push(deleteSessionById(s.id, user?.sub))
        })
        await Promise.all(sessionDeletes).then(() => {
            setUserAllSessions(user?.sub)
        })
    }

    async function modifySelectedLabels(label: Label | undefined) {
        const newEditedSessions = new Map(editedSessions)

        let selectedSessions: Session[] = []
        Object.keys(selectedSessionRows).forEach(x => selectedSessions.push(userAllSessions[parseInt(x)]))
        selectedSessions.forEach(s => {
            newEditedSessions.set(s.id, { title: s.title, labelId: label?.id ?? undefined })
        })

        setEditedSessions(newEditedSessions)
    }

    function handleRowSelectionChange(updater: Updater<RowSelectionState>) {
        const newValue = functionalUpdate(updater, selectedSessionRows)
        setSelectedSessionRows(newValue)
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
                        <div className="my-4">
                            <article className="prose lg:prose-xl pb-4 md:pb-0"><h1>Sessions</h1></article>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 mb-2 min-w-[300px]">
                            <div className="flex justify-end md:justify-start mb-2 md:mb-0 ">
                                {Object.keys(selectedSessionRows).length !== 0
                                    ? <BulkActions
                                        numSelected={Object.keys(selectedSessionRows).length}
                                        onBulkDelete={deleteSelectedSessions}
                                        onBulkLabelChange={modifySelectedLabels} />
                                    : <div></div>}
                            </div>
                            <div className="flex justify-end gap-4 items-center">
                                {editedSessions.size !== 0 && <SaveButton onClick={updateEditedSessions} />}
                                <NewSessionDialog />
                            </div>
                        </div>

                        <DataTable data={userAllSessions} columns={sessionColumns}
                            state={{ rowSelection: selectedSessionRows }}
                            onRowSelectionChange={handleRowSelectionChange} />
                    </TabsContent>
                    <TabsContent value="labels">
                        <div className="grid grid-cols-1 md:grid-cols-2 pt-6 pb-4">
                            <article className="prose lg:prose-xl pb-4 md:pb-0"><h1>Labels</h1></article>
                            <div className="flex justify-end gap-4 items-center">
                                {editedLabels.size !== 0 && <SaveButton onClick={updateEditedLabels} />}
                                <NewLabelDialog />
                            </div>

                        </div>
                        <DataTable data={labels} columns={labelColumns} state={{ rowSelection: {} }} />
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}