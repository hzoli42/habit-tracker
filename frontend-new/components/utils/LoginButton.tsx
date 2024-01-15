'use client'
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    fetch('/api/auth/login', {mode: 'no-cors'})
  };

  return (
    <button className="button__login" onClick={handleLogin}>
      Login
    </button>
  );
};