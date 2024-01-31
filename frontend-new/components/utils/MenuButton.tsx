'use client'
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button } from "../ui/button";

export default function MenuButton({ value, link }: { value: string, link: string }) {
  return (
    <a href={link} className="w-full py-2">
      {value}
    </a>
  );

}