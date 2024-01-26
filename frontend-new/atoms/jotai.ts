import { atom } from 'jotai'

export type LabelData = {
    id: string
    labelName: string
    labelColor: string
}

export type LabelsResponse = {
    id: string
    labels: LabelData[]
}

const labelsPrimitiveAtom = atom<LabelData[]>([])
export const labelsAtom = atom(
    (get) => get(labelsPrimitiveAtom),
    async (get, set, user_id)  => {
        if (user_id == undefined) {
            set(labelsPrimitiveAtom, [])
            return
        }
        fetch(`http://0.0.0.0:5000/user/${user_id}/labels`, {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => response.json())
            .then((data: LabelsResponse) => {
                console.log(`Id = ${data.id}, Labels = ${data.labels}`)
                const labelsProcessed = data.labels.map((ld, i, a) => { 
                    return {id: ld.id, labelName: ld.labelName, labelColor: ld.labelColor}
                })
                set(labelsPrimitiveAtom, labelsProcessed)
            })
    }
)

export const editedLabelsAtom = atom<Map<string, {name: string, color: string}>>(new Map())

export type Session = {
    id: string
    title: string
    label_id: string
    duration: string
    date: string
}

export type SessionResponse = {
    id: string,
    title: string,
    user_id: string,
    label_id: string,
    actions: [
        {
            timestamp: number,
            event: string
        }
    ]
}

const userAllSessionsPrimitiveAtom = atom<Session[]>([])
export const userAllSessionsAtom = atom(
    (get) => get(userAllSessionsPrimitiveAtom),
    async (get, set, user_id) => {
        if (user_id == undefined) {
            set(userAllSessionsPrimitiveAtom, [])
            return
        }
        fetch(`http://0.0.0.0:5000/session/all/${user_id}`, {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => response.json())
            .then(response_data => {
                set(userAllSessionsPrimitiveAtom, response_data
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
                            label_id: session.label_id,
                            duration: duration,
                            date: new Date(start.timestamp * 1000).toDateString()
                        }
                    })
                )
            })
    }
)

export const editedSessionsAtom = atom<Map<string, {title: string, label_id: string}>>(new Map())