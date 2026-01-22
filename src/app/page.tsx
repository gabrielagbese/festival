"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import homeData from "./data/home.json";
import festivalsData from "./data/festivals.json";
import workshopsData from "./data/workshops.json";
import festivalData from "./data/2025.json";
import { GalleryModal } from "../components/GalleryModal";
import { PressCoverage } from "../components/PressCoverage";
import { SponsorCarousel } from "../components/SponsorCarousel";
import { SlideIn } from "../components/SlideIn";
import Countdown from "react-countdown";
import { PixelatedFade } from "@/components/PixelatedFade";
import { useState } from "react";
import { Globe, BookOpen, Link as LinkIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function Home() {
    const upcomingEvent =
        new Date(homeData.eventDate) > new Date() ? "festival" : "workshop";
    const eventDate = new Date(homeData.eventDate);

    return (
        <div 
            className="container mx-auto px-4 lg:px-12 py-8"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23d4d4d4' fill-opacity='0.4'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
            }}
        >
            {/* Hero with countdown */}
            <SlideIn>
                <section className="relative overflow-hidden mb-16 max-w-7xl mx-auto">
                    <div className="relative z-10 flex flex-col lg:flex-row items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="w-full lg:w-1/2 relative h-64 sm:h-80 lg:h-[500px]">
                            <Image
                                src={homeData.heroImage}
                                alt="Tech Festival Hero"
                                layout="fill"
                                objectFit="cover"
                                className="object-center"
                            />
                            <div className="absolute inset-0 bg-black/20"></div>
                        </div>
                        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
                            <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-white  tracking-tight">
                                {homeData.heroTitle}
                            </h1>
                            <p className="text-lg lg:text-xl mb-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {homeData.heroSubtitle}
                            </p>
                            <div className="mb-8 p-4 bg-orange-50 dark:bg-orange-950/30 border-l-4 border-orange-500 rounded-r-md">
                                <div className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                                    Coming Soon
                                </div>
                                
                            </div>
                            <div>
                                <Link href="/2026">
                                    <Button
                                        size="lg"
                                        className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-md px-8 h-12 text-base font-medium transition-all"
                                    >
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </SlideIn>

            {/* Sponsors Carousel */}
            <SlideIn direction="right" delay={0.2}>
                <section className="mb-24">
                    <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-widest text-zinc-500 ">
                        Our Partners
                    </h2>
                    <SponsorCarousel sponsors={homeData.sponsors} />
                </section>
            </SlideIn>
            {/* About Festival */}
            <SlideIn direction="left" delay={0.3}>
                <section className="mb-24 max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6  text-zinc-900 dark:text-white">
                            About the Festival
                        </h2>
                        <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 lg:p-12 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                        <p className="text-lg lg:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed text-center max-w-4xl mx-auto">
                            {homeData.aboutFestival}
                        </p>
                    </div>
                </section>
            </SlideIn>
            {/* Previous Festivals */}
            <SlideIn direction="right" delay={0.4}>
                <section className="mb-24">
                    <div className="flex justify-between items-end mb-10 px-4">
                        <h2 className="text-3xl font-bold  text-zinc-900 dark:text-white">
                            Previous Editions
                        </h2>
                        <div className="hidden md:block text-zinc-500 text-sm font-semibold uppercase tracking-wider">
                            Archive
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {Object.entries(festivalsData)
                            // Exclude the last entry
                            .map(([year, festival], index) => (
                                <SlideIn
                                    key={year}
                                    direction="up"
                                    delay={0.1 * index}
                                >
                                    <div className="group cursor-pointer">
                                        <div className="relative overflow-hidden rounded-xl mb-4 shadow-sm group-hover:shadow-md transition-all duration-300 border border-zinc-200 dark:border-zinc-800">
                                            <Image
                                                src={
                                                    festival.thumbnail ||
                                                    "/placeholder.svg"
                                                }
                                                alt={festival.title}
                                                width={400}
                                                height={300}
                                                className="w-full aspect-[4/3] object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                                <span className="text-white font-medium">View Archive</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white ">
                                            {festival.title}
                                        </h3>
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 leading-relaxed">
                                            {festival.brief}
                                        </p>
                                        <Link
                                            href={`/festival/${year}`}
                                            className="text-orange-600 dark:text-orange-500 text-sm font-medium mt-3 inline-flex items-center gap-1 hover:gap-2 transition-all"
                                        >
                                            Explore <span aria-hidden="true">&rarr;</span>
                                        </Link>
                                    </div>
                                </SlideIn>
                            ))}
                    </div>
                </section>
            </SlideIn>
            {/* About Workshop */}
            <SlideIn direction="left" delay={0.5}>
                <section className="mb-24">
                    <div className="bg-zinc-900 text-white rounded-2xl overflow-hidden shadow-xl">
                        <div className="flex flex-col lg:flex-row">
                            <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
                                <h2 className="text-3xl lg:text-4xl font-bold mb-6 ">
                                    About the Workshop
                                </h2>
                                <p className="text-lg text-zinc-300 mb-8 leading-relaxed">
                                    {homeData.aboutWorkshop}
                                </p>
                                <div>
                                    <Link href="/workshop/2024" passHref>
                                        <Button
                                            variant="outline"
                                            className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-colors rounded-md px-8 h-12"
                                        >
                                            Learn More
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="lg:w-1/2 relative h-64 lg:h-auto min-h-[400px]">
                                <Image
                                    src="https://i.ibb.co/Q3bmGzyW/wsp.jpg"
                                    alt="Workshop preview"
                                    layout="fill"
                                    objectFit="cover"
                                    className="object-center"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </SlideIn>
            <Separator className="my-12" />
            {/* 2025 Speakers section hidden for 2026 launch
            <SlideIn direction="left" delay={0.6}>
                <PreFestivalSpeakersSection />
            </SlideIn>
            */}
            {/* Press Coverage */}
            <SlideIn direction="left" delay={0.7}>
                <PressCoverage articles={homeData.pressAppearances} />
            </SlideIn>
            {/* Call to Collaborators */}
            <SlideIn direction="right" delay={0.8}>
                <section className="mb-24 bg-orange-50 dark:bg-orange-950/20 p-12 lg:p-20 rounded-2xl text-center border border-orange-100 dark:border-orange-900/50">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6  text-zinc-900 dark:text-white">
                        {homeData.callToAction.title}
                    </h2>
                    <p className="mb-10 text-lg lg:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
                        {homeData.callToAction.description}
                    </p>
                    <Button className="bg-orange-600 text-white hover:bg-orange-700 h-12 px-8 rounded-md text-base" asChild>
                        <a href="/contact">
                            {homeData.callToAction.buttonText}
                        </a>
                    </Button>
                </section>
            </SlideIn>
            {/* Gallery */}
            <SlideIn direction="up" delay={0.9}>
                <section className="mb-24">
                    <h2 className="text-3xl font-bold mb-10  text-zinc-900 dark:text-white">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {homeData.gallery.map((item, index) => (
                            <GalleryModal
                                key={index}
                                images={homeData.gallery}
                                initialSlide={index}
                            >
                                <div className="cursor-pointer">
                                    <Image
                                        src={item.image || "/placeholder.svg"}
                                        alt={item.alt}
                                        width={300}
                                        height={300}
                                        className="rounded-lg object-cover w-full h-full aspect-square"
                                    />
                                </div>
                            </GalleryModal>
                        ))}
                    </div>
                </section>
            </SlideIn>
        </div>
    );
}

function CountdownTimer({ targetDate }: { targetDate: Date | string }) {
    // Implement countdown logic here
    return <div>00:00:00</div>;
}

interface Speaker {
    name: string;
    role: string;
    image: string;
    bio: string;
    alias?: string;
    workshop?: {
        title: string;
        description: string;
    };
    socials?: {
        website?: string;
        blog?: string;
        linktree?: string;
    };
}

function PreFestivalSpeakersSection() {
    const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

    return (
        <>
            <div className="mb-24">
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 lg:p-12 shadow-sm">
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2 ">
                            2025 Workshop Speakers
                        </h2>
                        <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        {festivalData.speakers.map((speaker, index) => (
                            <div
                                key={index}
                                className="group cursor-pointer text-center"
                                onClick={() => setSelectedSpeaker(speaker)}
                            >
                                <div className="aspect-square relative mb-4 overflow-hidden rounded-full border-2 border-transparent group-hover:border-orange-500 transition-all duration-300">
                                    <Image
                                        src={speaker.image || "/placeholder.svg"}
                                        alt={speaker.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-orange-600 transition-colors">
                                    {speaker.name}
                                </h3>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                                    {speaker.role}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Dialog
                open={!!selectedSpeaker}
                onOpenChange={() => setSelectedSpeaker(null)}
            >
                {selectedSpeaker && (
                    <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh] p-0 gap-0 border-none bg-white dark:bg-zinc-900">
                         <div className="flex flex-col md:flex-row h-full">
                            <div className="md:w-2/5 relative h-64 md:h-auto bg-zinc-100 dark:bg-zinc-800">
                                <Image
                                    src={selectedSpeaker.image || "/placeholder.svg"}
                                    alt={selectedSpeaker.name}
                                    fill
                                    className="object-cover object-center"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white md:hidden">
                                    <h2 className="text-2xl font-bold">{selectedSpeaker.name}</h2>
                                    <p className="opacity-90">{selectedSpeaker.role}</p>
                                </div>
                            </div>
                            <div className="md:w-3/5 p-8 md:p-10 flex flex-col h-full max-h-[60vh] md:max-h-[80vh] overflow-y-auto">
                                <div className="hidden md:block mb-6">
                                    <DialogTitle className="text-3xl font-bold text-zinc-900 dark:text-white  mb-1">
                                        {selectedSpeaker.name}
                                    </DialogTitle>
                                    <DialogDescription className="text-lg text-orange-600 font-medium">
                                        {selectedSpeaker.role}
                                    </DialogDescription>
                                </div>
                                
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm uppercase tracking-wider font-semibold text-zinc-500 mb-3">Biography</h4>
                                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                            {selectedSpeaker.bio}
                                        </p>
                                    </div>
                                    
                                    {selectedSpeaker.workshop && (
                                        <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-100 dark:border-orange-800/30">
                                            <h4 className="text-sm uppercase tracking-wider font-bold text-orange-700 dark:text-orange-400 mb-2">
                                                Workshop: {selectedSpeaker.workshop.title}
                                            </h4>
                                            <p className="text-zinc-700 dark:text-zinc-300 text-sm">
                                                {selectedSpeaker.workshop.description}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {selectedSpeaker.socials && (
                                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-4">
                                            {selectedSpeaker.socials.website && (
                                                <a href={selectedSpeaker.socials.website} target="_blank" rel="noopener noreferrer" 
                                                   className="flex items-center gap-2 text-zinc-500 hover:text-orange-600 transition-colors text-sm font-medium bg-zinc-50 dark:bg-zinc-800 px-3 py-2 rounded-md">
                                                    <Globe className="h-4 w-4" /> Website
                                                </a>
                                            )}
                                            {selectedSpeaker.socials.blog && (
                                                <a href={selectedSpeaker.socials.blog} target="_blank" rel="noopener noreferrer"
                                                   className="flex items-center gap-2 text-zinc-500 hover:text-orange-600 transition-colors text-sm font-medium bg-zinc-50 dark:bg-zinc-800 px-3 py-2 rounded-md">
                                                    <BookOpen className="h-4 w-4" /> Blog
                                                </a>
                                            )}
                                            {selectedSpeaker.socials.linktree && (
                                                <a href={selectedSpeaker.socials.linktree} target="_blank" rel="noopener noreferrer"
                                                   className="flex items-center gap-2 text-zinc-500 hover:text-orange-600 transition-colors text-sm font-medium bg-zinc-50 dark:bg-zinc-800 px-3 py-2 rounded-md">
                                                    <LinkIcon className="h-4 w-4" /> Links
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
}
