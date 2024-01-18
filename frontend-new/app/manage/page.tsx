import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
    return (
        <main>
            <div className="container mx-auto max-w-screen-lg">
                <Tabs defaultValue="sessions">
                    <TabsList>
                        <TabsTrigger value="sessions">Sessions</TabsTrigger>
                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sessions">
                        <div></div>
                    </TabsContent>
                    <TabsContent value="analysis">
                        <div></div>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}