export type Label = {
    label_id: string
    user_id: string
    name: string
    color: string
}

export function getAllUserLabels(userId: string | undefined | null): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/label/user/${userId ?? "undefined"}`, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
    })
}

export function postLabelNew(userId: string | undefined | null, name: string, color: string): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/label/user/${userId ?? "undefined"}`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            color: color
        })
    })
}

export function postLabelUpdate(labelId: string, userId: string | undefined | null, name: string, color: string): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/label/${labelId}/user/${userId ?? "undefined"}`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            color: color
        })
    })
}

export function deleteLabel(labelId: string, userId: string | undefined | null): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/label/${labelId}/user/${userId ?? "undefined"}`, {
        method: "DELETE",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
    })
}