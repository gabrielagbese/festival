"use client";

import { useEffect, useRef } from "react";

const widgetUrl =
    "https://widget.tix.africa/cavicfestival2026/VXNlci0wNWRiYzFhNS1iNmE1LTRiZGEtOTQxMi05ZmRiZDMxZWUzMGQ=";

export default function TixCheckout() {
    const widgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const widget = widgetRef.current;
        if (!widget) return;

        // Keep the vendor script inside its widget, and initialize on each
        // mount so checkout also works after Next.js client-side navigation.
        const script = document.createElement("script");
        script.src = "https://widget.tix.africa/widget.js";
        script.dataset.url = widgetUrl;
        script.async = true;
        widget.appendChild(script);

        return () => script.remove();
    }, []);

    return (
        <>
            <div ref={widgetRef} className="tt-widget w-full">
                <div className="tt-widget-fallback h-[640px] sm:h-[720px]">
                    <iframe
                        src={widgetUrl}
                        title="Cavic Festival 2026 ticket checkout"
                        className="h-full w-full border-0"
                    />
                </div>
            </div>
            <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Having trouble with checkout?{" "}
                <a
                    href={widgetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-orange-600 underline underline-offset-4 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
                >
                    Open ticket checkout in a new tab
                </a>
                .
            </p>
        </>
    );
}
