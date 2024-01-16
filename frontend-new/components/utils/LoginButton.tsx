'use client'
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button className="button__login">
       <a href="/api/auth/login">Log In</a>
    </button>
  );
};