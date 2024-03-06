export type Session = {
    session_id: string
    title: string
    label_id: string | undefined
    duration: string
    start_date: Date
    end_date: Date
}

export type SessionResponse = {
    session_id: string,
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

export function processSessionResponse(session: SessionResponse) {
    const formatDuration = (durationObject: Date) => {
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
    const start = session.actions.filter(a => a.event == "start")[0]
    const stop = session.actions.filter(a => a.event == "stop")[0]
    let duration = "Session has not ended yet"
    if (stop != null && stop != undefined) {
        const durationObject = new Date(stop.timestamp - start.timestamp)
        duration = formatDuration(durationObject)
    } 
    return {
        session_id: session.session_id,
        title: session.title,
        label_id: session.label_id,
        duration: duration,
        start_date: new Date(start.timestamp),
        end_date: new Date(stop ? stop.timestamp : start.timestamp)
    }
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
    labelId: string | undefined): Promise<Response> {
    
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/session/${sessionId}/user/${userId ?? "undefined"}`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: title,
            label_id: labelId ?? "",
        })
    })
}