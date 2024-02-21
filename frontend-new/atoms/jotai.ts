import { getAllUserLabels, getAllUserSessions } from '@/lib/api_utils'
import { atom } from 'jotai'

export type Label = {
    id: string
    user_id: string
    name: string
    color: string
}

export type LabelsResponse = Label[]

const labelsPrimitiveAtom = atom<Label[]>([])
export const labelsAtom = atom(
    (get) => get(labelsPrimitiveAtom),
    async (get, set, user_id: string | undefined | null)  => {
        if (user_id === undefined || user_id === null) {
            set(labelsPrimitiveAtom, [])
            return
        }
        getAllUserLabels(user_id)
            .then(response => response.json())
            .then((data: LabelsResponse) => {
                const labelsProcessed = data.map((ld, i, a) => { 
                    return {id: ld.id, user_id: ld.user_id, name: ld.name, color: ld.color}
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
    start_date: Date
    end_date: Date
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


function formatDuration(durationObject: Date) {
    const days = durationObject.getUTCDate() - 1
    const hours = durationObject.getUTCHours()
    const minutes = durationObject.getUTCMinutes()
    const seconds = durationObject.getUTCSeconds()
    const daysString = days > 0 ? `${days}d` : ''
    const hoursString = (hours > 0 || daysString !== '') ? `${hours}h` : ''
    const minutesString = (minutes > 0 || hoursString !== '') ? `${minutes}m` : ''
    const secondsString = `${seconds}s`
    return `${daysString} ${hoursString} ${minutesString} ${secondsString}`
}
const userAllSessionsPrimitiveAtom = atom<Session[]>([])
export const userAllSessionsAtom = atom(
    (get) => get(userAllSessionsPrimitiveAtom),
    async (get, set, user_id: string | undefined | null) => {
        if (user_id === undefined || user_id === null) {
            set(userAllSessionsPrimitiveAtom, [])
            return
        }
        getAllUserSessions(user_id)
            .then(response => response.json())
            .then(response_data => {
                set(userAllSessionsPrimitiveAtom, response_data
                    .map((session: SessionResponse) => {
                        const start = session.actions.filter(a => a.event == "start")[0]
                        const stop = session.actions.filter(a => a.event == "stop")[0]
                        let duration = "This session does not have an end time"
                        if (stop != null) {
                            const durationObject = new Date(stop.timestamp - start.timestamp)
                            duration = formatDuration(durationObject)
                        }
                        return {
                            id: session.id,
                            title: session.title,
                            label_id: session.label_id,
                            duration: duration,
                            start_date: new Date(start.timestamp),
                            end_date: new Date(stop.timestamp)
                        }
                    })
                )
            })
    }
)

export const editedSessionsAtom = atom<Map<string, {title: string, labelId: string | undefined}>>(new Map())

export const viewportAtom = atom<{width: number, height: number}>({width: 0, height: 0})