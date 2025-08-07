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
        <div className="container mx-auto px-4 lg:px-12 py-8">
            {/* Hero with countdown */}
            <SlideIn>
                <section className="relative overflow-hidden shadow-lg rounded-lg mb-12 max-w-6xl lg:p-[12px] mx-auto  bg-gradient-to-r from-orange-600/75 to-orange-400/75 p-[5px] border-gray-400 border ">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-75"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row">
                        <div className=" filter grayscale-[40%]  w-full lg:w-2/5 h-64 sm:h-56 md:h-64 lg:h-auto relative">
                            <Image
                                src={homeData.heroImage}
                                alt="Tech Festival Hero"
                                layout="fill"
                                objectFit="cover"
                                className="object-[right_top] lg:object-[left_20%] rounded-md"
                            />
                        </div>
                        {/* <PixelatedFade direction="right" /> */}
                        <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center items-center  text-center lg:text-left">
                            <h1 className="text-2xl lg:text-4xl pl-4 font-bold mb-2 sm:mb-4 text-white">
                                {homeData.heroTitle}
                            </h1>
                            <p className="text-sm sm:text-xl mb-4 pl-4 sm:mb-6 text-white">
                                {homeData.heroSubtitle}
                            </p>
                            <div className="text-4xl sm:text-5xl pl-4 lg:text-4xl font-bold mb-4 sm:mb-6 text-white">
                                {/* <CountdownTimer targetDate={eventDate} /> */}
                                <p>Coming Soon!</p>
                            </div>
                            <Button
                                size="lg"
                                className="bg-black ml-4 text-white hover:shadow-md
                                "
                            >
                                <a href="/2025">Learn More</a>
                            </Button>
                        </div>
                    </div>
                </section>
            </SlideIn>
            <section className="flex justify-center my-4 bg-white lg:p-4">
                <div className="w-full lg:w-1/2 h-auto  flex justify-center">
                    <Image
                        src="https://i.ibb.co/S465WfDy/Whats-App-Image-2025-02-04-at-14-56-06.jpg"
                        alt="hero"
                        width={600}
                        height={600}
                    />
                </div>
            </section>
            {/* Sponsors Carousel */}
            <SlideIn direction="right" delay={0.2}>
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-center">
                        Our Partners:
                    </h2>
                    <SponsorCarousel sponsors={homeData.sponsors} />
                </section>
            </SlideIn>
            {/* About Festival */}
            <SlideIn direction="left" delay={0.3}>
                <section className="mb-12 ">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-accent text-4xl">
                                About the Festival
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="lg:text-xl">
                                {homeData.aboutFestival}
                            </p>
                        </CardContent>
                    </Card>
                </section>
            </SlideIn>
            {/* Previous Festivals */}
            <SlideIn direction="right" delay={0.4}>
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">
                        Previous Festivals:
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(festivalsData)
                            // Exclude the last entry
                            .map(([year, festival], index) => (
                                <SlideIn
                                    key={year}
                                    direction="up"
                                    delay={0.1 * index}
                                >
                                    <Card className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <CardTitle>
                                                {festival.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Image
                                                src={
                                                    festival.thumbnail ||
                                                    "/placeholder.svg"
                                                }
                                                alt={festival.title}
                                                width={300}
                                                height={200}
                                                className="rounded-lg mb-4 aspect-square object-cover"
                                            />
                                            <p className="line-clamp-3">
                                                {festival.brief}
                                            </p>
                                            <Link
                                                href={`/festival/${year}`}
                                                className="text-accent hover:underline mt-2 inline-block"
                                            >
                                                Learn more
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </SlideIn>
                            ))}
                    </div>
                </section>
            </SlideIn>
            {/* About Workshop */}
            <SlideIn direction="left" delay={0.5}>
                <section className="mb-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-accent text-4xl">
                                About the Workshop
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col lg:flex-row gap-8">
                                <div className="lg:w-2/3">
                                    <p className="lg:text-xl mb-4">
                                        {homeData.aboutWorkshop}
                                    </p>
                                    <Link href="/workshop/2024" passHref>
                                        <Button
                                            variant="outline"
                                            className="mt-4 bg-accent lg:mt-20"
                                        >
                                            Learn More
                                        </Button>
                                    </Link>
                                </div>
                                <div className="lg:w-1/3 order-first lg:order-last mb-6 lg:mb-0">
                                    <Image
                                        src="https://i.ibb.co/Q3bmGzyW/wsp.jpg"
                                        alt="Workshop preview"
                                        width={400}
                                        height={300}
                                        className="rounded-lg object-cover w-full h-auto border"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </SlideIn>
            <Separator className="my-12" />
            <SlideIn direction="left" delay={0.6}>
                <PreFestivalSpeakersSection />
            </SlideIn>
            {/* Press Coverage */}
            <SlideIn direction="left" delay={0.7}>
                <PressCoverage articles={homeData.pressAppearances} />
            </SlideIn>
            {/* Call to Collaborators */}
            <SlideIn direction="right" delay={0.8}>
                <section className="mb-12 bg-accent/20 p-8 rounded-lg">
                    <h2 className="text-3xl font-bold mb-4 ">
                        {homeData.callToAction.title}
                    </h2>
                    <p className="mb-6">{homeData.callToAction.description}</p>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent">
                        <a href="/contact">
                            {homeData.callToAction.buttonText}
                        </a>
                    </Button>
                </section>
            </SlideIn>
            {/* Gallery */}
            <SlideIn direction="up" delay={0.9}>
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">Gallery</h2>
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

function CountdownTimer({ targetDate }) {
    // Implement countdown logic here
    return <div>00:00:00</div>;
}

function PreFestivalSpeakersSection() {
    const [selectedSpeaker, setSelectedSpeaker] = useState(null);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-orange-900">
                    2025 Pre-Festival Workshop Speakers
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {festivalData.speakers.map((speaker, index) => (
                        <div
                            key={index}
                            className="cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => setSelectedSpeaker(speaker)}
                        >
                            <div className="aspect-square relative mb-4">
                                <Image
                                    src={speaker.image || "/placeholder.svg"}
                                    alt={speaker.name}
                                    fill
                                    className="object-cover rounded-lg object-[center_top]"
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-center">
                                {speaker.name}
                            </h3>
                            <p className="text-center text-gray-600 text-sm">
                                {speaker.role}
                            </p>
                        </div>
                    ))}
                </div>
            </CardContent>

            <Dialog
                open={!!selectedSpeaker}
                onOpenChange={() => setSelectedSpeaker(null)}
            >
                {selectedSpeaker && (
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold mb-2">
                                {selectedSpeaker.name}
                                {selectedSpeaker.alias && (
                                    <span className="text-orange-600 block text-base">
                                        "{selectedSpeaker.alias}"
                                    </span>
                                )}
                            </DialogTitle>
                            <DialogDescription className="text-base text-orange-600 font-medium">
                                {selectedSpeaker.role}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col md:flex-row gap-6 p-4">
                            <div className="md:w-1/3 flex-shrink-0">
                                <div className="aspect-[3/4] relative rounded-lg overflow-hidden shadow-lg">
                                    <Image
                                        src={
                                            selectedSpeaker.image ||
                                            "/placeholder.svg"
                                        }
                                        alt={selectedSpeaker.name}
                                        fill
                                        className="object-cover object-[center_top]"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>
                                {selectedSpeaker.socials && (
                                    <div className="mt-4 flex gap-4 items-center justify-center">
                                        {selectedSpeaker.socials.website && (
                                            <a
                                                href={
                                                    selectedSpeaker.socials
                                                        .website
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                                            >
                                                <Globe className="h-4 w-4" />
                                                <span className="text-sm">
                                                    Website
                                                </span>
                                            </a>
                                        )}
                                        {selectedSpeaker.socials.blog && (
                                            <a
                                                href={
                                                    selectedSpeaker.socials.blog
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                                            >
                                                <BookOpen className="h-4 w-4" />
                                                <span className="text-sm">
                                                    Blog
                                                </span>
                                            </a>
                                        )}
                                        {selectedSpeaker.socials.linktree && (
                                            <a
                                                href={
                                                    selectedSpeaker.socials
                                                        .linktree
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                                            >
                                                <LinkIcon className="h-4 w-4" />
                                                <span className="text-sm">
                                                    Links
                                                </span>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="md:w-2/3">
                                <div className="prose prose-orange max-w-none text-sm">
                                    <p className="whitespace-pre-line text-gray-700">
                                        {selectedSpeaker.bio}
                                    </p>
                                    {selectedSpeaker.workshop && (
                                        <div className="mt-4">
                                            <h4 className="text-lg font-semibold text-orange-900">
                                                {selectedSpeaker.workshop.title}
                                            </h4>
                                            <p className="text-gray-700">
                                                {
                                                    selectedSpeaker.workshop
                                                        .description
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </Card>
    );
}
