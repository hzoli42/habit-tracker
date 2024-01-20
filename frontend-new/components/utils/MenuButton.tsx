'use client'
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button } from "../ui/button";

export default function MenuButton({ value, link }: { value: string, link: string }) {
  return (
    <Button variant="ghost">
      <a href={link}>{value}</a>
    </Button>
  );

}