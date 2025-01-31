"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Sponsor {
    name: string;
    logo: string;
}

interface SponsorCarouselProps {
    sponsors: Sponsor[];
}

export function SponsorCarousel({ sponsors }: SponsorCarouselProps) {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    );

    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
        >
            <CarouselContent>
                {sponsors.map((sponsor, index) => (
                    <CarouselItem
                        key={index}
                        className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                        <div className="p-1">
                            <Card className="border-none shadow-none aspect-video flex flex-col items-center justify-center bg-white overflow-clip">
                                <CardContent className="flex  items-center justify-center p-2 h-12">
                                    <Image
                                        src={sponsor.logo || "/placeholder.svg"}
                                        alt={sponsor.name}
                                        width={200}
                                        height={100}
                                        className="object-contain"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
