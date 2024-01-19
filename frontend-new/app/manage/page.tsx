'use client'
import { labelsAtom } from "@/atoms/jotai";
import SessionsTable from "@/components/ManagePage/SessionsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useAtom } from "jotai";
import { useEffect } from "react";

export default function Home() {
    const { user, error, isLoading } = useUser();
    const [labels, setLabels] = useAtom(labelsAtom)

    useEffect(() => {
        if (isLoading) {
            return
        }
        setLabels(user?.sub)
    }, [isLoading])

    return (
        <main>
            <div className="container mx-auto max-w-screen-lg">
                <Tabs defaultValue="sessions">
                    <TabsList>
                        <TabsTrigger value="sessions">Sessions</TabsTrigger>
                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sessions">
                        <article className="prose lg:prose-xl py-4"><h1>Sessions</h1></article>
                        <SessionsTable />
                    </TabsContent>
                    <TabsContent value="analysis">
                        <div></div>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}