import { atom, useAtom } from "jotai";
import { Action, StopwatchTime } from "./page";

export const isActiveAtom = atom(false);
export const timeAtom = atom<StopwatchTime>( {hours: 0, minutes: 0, seconds: 0});
export const sessionIdAtom = atom("");
export const titleInputAtom = atom("");
export const actionsAtom = atom<Action[]>([]);