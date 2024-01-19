import { atom } from 'jotai'

const labelsPrimitiveAtom = atom<string[]>([])
export const labelsAtom = atom(
    (get) => get(labelsPrimitiveAtom),
    async (get, set, user_id)  => {
        fetch(`http://0.0.0.0:5000/user/${user_id}/labels`, {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => response.json())
            .then(data => {
                console.log(`Id = ${data.id}, Labels = ${data.labels}`)
                set(labelsPrimitiveAtom, data.labels)
            })
    }
)