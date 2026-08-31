import {create} from "zustand";

interface hopitalName {
    name: string;
}

export const useHopitalName = create<hopitalName>((set) => ({
    name: "متسشفى التعاون",
}));
