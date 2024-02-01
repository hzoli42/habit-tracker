import { UserProfile } from "@auth0/nextjs-auth0/client";

export async function createUserIfNew(user: UserProfile): Promise<Response> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user/new`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            sub: user.sub,
            email: user.email,
            name: user.name,
            nickname: user.nickname
        })
    })
}