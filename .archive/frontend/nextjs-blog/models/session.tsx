 export type Action = {
    timestamp: number;
    action: string;
}

export type Session = {
    id: string;
    user_id: string;
    actions: Action[];
    title: string;
    tags: string[];
}