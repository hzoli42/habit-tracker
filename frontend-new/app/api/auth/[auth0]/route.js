// 'use client'
// app/api/auth/[auth0]/route.js


import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
    login(req, res) {
        const url = new URL(req.url)
        const urlParams = new URLSearchParams(url.searchParams)
        const signup = urlParams.get('signup')     
        return handleLogin(req, res, {
            authorizationParams: {
                screen_hint: signup === "true" ? "signup" : "login",
            },
            returnTo:'/track'
        });
    }
});