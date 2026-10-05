"use client";

import { usePathname } from "next/navigation";
import { MouseTrail } from "@stichiboi/react-elegant-mouse-trail";

export default function MouseTrailWrapper() {
    const pathname = usePathname();
    if (/^\/(dashboard|orders|login)(\/|$)/.test(pathname)) return null;
    return <MouseTrail strokeColor={"#FF8541"} />;
}