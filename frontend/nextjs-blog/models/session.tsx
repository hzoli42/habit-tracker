 export type Action = {
    timestamp: number;
    action: string;
}

export type Session = {
    id: string;
    user: string;
    actions: Action[];
}