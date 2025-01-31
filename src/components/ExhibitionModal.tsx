"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

interface ExhibitionModalProps {
    exhibition: {
        name: string;
        description: string;
        image: string;
    };
    children: React.ReactNode;
}

export function ExhibitionModal({
    exhibition,
    children,
}: ExhibitionModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[800px]  ">
                <h2 className="text-2xl font-bold mb-4">{exhibition.name}</h2>
                <Image
                    src={exhibition.image || "/placeholder.svg"}
                    alt={exhibition.name}
                    width={800}
                    height={600}
                    className="rounded-lg mb-4"
                />
                <p>{exhibition.description}</p>
            </DialogContent>
        </Dialog>
    );
}
