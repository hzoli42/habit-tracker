'use client'
import NewLabelDialog from "@/app/manage/components/NewLabelDialog";
import NewSessionDialog from "@/app/manage/components/NewSessionDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@auth0/nextjs-auth0/client";
import { RowSelectionState, Updater, functionalUpdate } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DataTable from "@/components/utils/DataTable";
import BulkActions from "./components/BulkActions";
import SaveButton from "./components/SaveButton";
import { Label, deleteLabel, getAllUserLabels, postLabelUpdate } from "@/lib/api_utils/label";
import { Session, SessionResponse, deleteSessionById, getAllUserSessions, postSessionUpdate, processSessionResponse } from "@/lib/api_utils/session";
import { labelColumns } from "./components/table/labels/TableColumns";
import { sessionColumns } from "./components/table/sessions/TableColumns";


function Home() {
    const { user, isLoading } = useUser();
    const [labels, setLabels] = useState<Label[]>([])
    const [sessions, setSessions] = useState<Session[]>([])
    const [selectedSessionRows, setSelectedSessionRows] = useState<RowSelectionState>({})
    const router = useRouter()

    function reloadData(user_id: string | null | undefined) {
        getAllUserLabels(user_id)
            .then(r => r.json())
            .then((d: Label[]) => setLabels(d))
        getAllUserSessions(user_id)
            .then(r => r.json())
            .then((d: SessionResponse[]) => setSessions(
                d.map(sr => processSessionResponse(sr))
                    .sort((a, b) => b.end_date.getTime() - a.end_date.getTime())
            ))
    }

    useEffect(() => {
        if (isLoading) {
            return
        }
        if (user?.sub === null || user?.sub === undefined) {
            router.push('/')
        }
        reloadData(user?.sub)
    }, [isLoading])


    async function deleteSelectedSessions() {
        let selectedSessions: Session[] = []
        Object.keys(selectedSessionRows).forEach(x => selectedSessions.push(sessions[parseInt(x)]))

        let sessionDeletes: Promise<Response>[] = []
        selectedSessions.forEach(s => {
            sessionDeletes.push(deleteSessionById(s.session_id, user?.sub))
        })
        await Promise.all(sessionDeletes).then(() => {
            reloadData(user?.sub)
        })
        setSelectedSessionRows({})
    }

    // async function modifySelectedLabels(label: Label | undefined) {
    //     let selectedSessions: Session[] = []
    //     Object.keys(selectedSessionRows).forEach(x => selectedSessions.push(sessions[parseInt(x)]))
    // }

    function handleRowSelectionChange(updater: Updater<RowSelectionState>) {
        const newValue = functionalUpdate(updater, selectedSessionRows)
        setSelectedSessionRows(newValue)
    }

    return (
        <main>
            <Tabs defaultValue="sessions">
                <TabsList>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    <TabsTrigger value="labels">Labels</TabsTrigger>
                </TabsList>
                <TabsContent value="sessions">
                    <div className="my-4">
                        <article className="prose lg:prose-xl pb-4 md:pb-0"><h1>Sessions</h1></article>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 mb-2 min-w-[300px]">
                        <div className="flex justify-end sm:justify-start mb-2 sm:mb-0 ">
                            {Object.keys(selectedSessionRows).length !== 0
                                ? <BulkActions
                                    numSelected={Object.keys(selectedSessionRows).length}
                                    labels={labels}
                                    onBulkDelete={deleteSelectedSessions}
                                    onBulkLabelChange={() => null} />
                                : <div></div>}
                        </div>
                        <div className="flex justify-end gap-4 items-center">
                            <NewSessionDialog onDialogSubmit={() => reloadData(user?.sub)} />
                        </div>
                    </div>

                    <DataTable
                        data={sessions}
                        columns={sessionColumns}
                        labels={labels}
                        state={{ rowSelection: selectedSessionRows }}
                        onRowSelectionChange={handleRowSelectionChange}
                        onDataChange={() => reloadData(user?.sub)} />
                </TabsContent>
                <TabsContent value="labels">
                    <div className="grid grid-cols-1 md:grid-cols-2 pt-6 pb-4">
                        <article className="prose lg:prose-xl pb-4 md:pb-0"><h1>Labels</h1></article>
                        <div className="flex justify-end gap-4 items-center">
                            <NewLabelDialog onDialogSubmit={() => reloadData(user?.sub)} />
                        </div>

                    </div>
                    <DataTable
                        data={labels}
                        columns={labelColumns}
                        state={{ rowSelection: {} }}
                        onDataChange={() => reloadData(user?.sub)} />
                </TabsContent>
            </Tabs>
        </main>
    )
}

export default Home