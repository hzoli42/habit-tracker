import { atom } from "jotai";

export const viewportAtom = atom<{width: number, height: number}>({width: 0, height: 0})