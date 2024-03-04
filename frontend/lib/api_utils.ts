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

export function getAllUserSessions(userId: string | undefined | null): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/session/user/${userId ?? "undefined"}`, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
    })
}

export function deleteSessionById(sessionId: string, userId: string | undefined | null): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/session/${sessionId}/user/${userId}`, {
        method: "DELETE",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
    })
}

export function postSessionNew(userId: string | undefined | null, title: string, labelId: string | undefined, startTime: number): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/session/user/${userId ?? "undefined"}`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: title,
            label_id: labelId ?? "",
            action: {
                timestamp: startTime,
                event: "start"
            }
        })
    })
}

export function postSessionEventStop(
    sessionId: string, 
    userId: string | undefined | null, 
    timestamp: number): Promise<Response> {
    
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/session/${sessionId}/user/${userId ?? "undefined"}/event/stop`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: {
                event: "stop",
                timestamp: timestamp
            }
        })
    })
}

export function postSessionUpdate(
    sessionId: string, 
    userId: string | undefined | null, 
    title: string, 
    labelId: string): Promise<Response> {
    
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/session/${sessionId}/user/${userId ?? "undefined"}`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: title,
            label_id: labelId,
        })
    })
}