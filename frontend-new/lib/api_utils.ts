
export function getAllUserSessions(userId: string | undefined | null): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/session/user/${userId ?? "undefined"}`, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
    })
}

export function getAllUserLabels(userId: string | undefined | null): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/labels/user/${userId ?? "undefined"}`, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
    })
}

export function postNewLabel(userId: string | undefined | null, name: string, color: string): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/labels/new`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: userId ?? "undefined",
            name: name,
            color: color
        })
    })
}

export function postLabelUpdate(labelId: string, name: string, color: string): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/labels/${labelId}`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name,
            color: color
        })
    })
}

export function deleteLabel(labelId: string): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/labels/${labelId}`, {
        method: "DELETE",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
    })
}

export function deleteSessionById(sessionId: string): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/session/${sessionId}`, {
        method: "DELETE",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
    })
}

export function postSessionStart(userId: string | undefined | null, title: string, labelId: string | undefined, startTime: number): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/session/start`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: userId ?? "undefined",
            title: title,
            label_id: labelId,
            action: {
                timestamp: startTime,
                event: "start"
            }
        })
    })
}

export function postSessionStop(sessionId: string, endTime: number): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/session/stop`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: sessionId,
            action: {
                timestamp: endTime,
                event: "stop"
            }
        })
    })
}

export function postSessionModify(sessionId: string, title: string, labelId: string): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/session/${sessionId}`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: title,
            label_id: labelId
        })
    })
}