 export type Action = {
    timestamp: number;
    user: string;
}

export type Session = {
    id: string;
    user: string;
    actions: Action[];
}