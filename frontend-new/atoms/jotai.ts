import { atom } from 'jotai'

export type LabelData = {
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
        console.log(user_id)
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
                    return {labelName: ld.labelName, labelColor: ld.labelColor}
                })
                set(labelsPrimitiveAtom, labelsProcessed)
            })
    }
)

export const editedSessionsAtom = atom<Map<string, {title: string, label: LabelData}>>(new Map())