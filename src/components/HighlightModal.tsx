"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

interface HighlightModalProps {
    highlight: {
        title: string;
        description: string;
        images: string[];
        video: string;
        thumbnail: string;
    };
    children: React.ReactNode;
}

export function HighlightModal({ highlight, children }: HighlightModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[800px] lg:max-h-[95vh] overflow-auto">
                <h2 className="text-2xl font-bold mb-4">{highlight.title}</h2>
                <p className="mb-4">{highlight.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {highlight.images.map((image, index) => (
                        <Image
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`${highlight.title} image ${index + 1}`}
                            width={400}
                            height={300}
                            className="rounded-lg aspect-square object-cover"
                        />
                    ))}
                </div>
                <iframe
                    width="100%"
                    height="315"
                    src={highlight.video}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </DialogContent>
        </Dialog>
    );
}
