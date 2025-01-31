"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryModalProps {
    images: { image: string; alt: string }[];
    initialSlide?: number;
    children: React.ReactNode;
}

export function GalleryModal({
    images,
    initialSlide = 0,
    children,
}: GalleryModalProps) {
    const [currentSlide, setCurrentSlide] = useState(initialSlide);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-clip">
                <div className="relative overflow-clip">
                    <Image
                        src={images[currentSlide].image || "/placeholder.svg"}
                        alt={images[currentSlide].alt}
                        width={800}
                        height={800} // Keep the image square
                        className="rounded-lg object-cover aspect-square w-full h-full overflow-hidden"
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2"
                        onClick={prevSlide}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={nextSlide}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                {/* <p className="text-center mt-2">{images[currentSlide].alt}</p> */}
            </DialogContent>
        </Dialog>
    );
}
