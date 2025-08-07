"use client";
import Image from "next/image";
import { Globe, BookOpen, Link } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState, useRef } from "react";
import festivalData from "../data/2025.json";

export default function CavicFestival2025() {
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef(null);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    if (!festivalData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-12">
            <Card
                className="bg-gradient-to-r from-orange-600 to-orange-400 overflow-hidden text-white 
      flex flex-col lg:flex-row items-center "
            >
                <div className="relative w-full max-w-sm mx-auto aspect-square p-2 flex justify-center items-center rounded-lg overflow-clip">
                    <video
                        ref={videoRef}
                        src="/video.mp4"
                        autoPlay
                        loop
                        className="p-4 object-cover rounded-lg w-full h-full"
                    />
                    <button
                        onClick={toggleMute}
                        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                        aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                        {isMuted ? (
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                            </svg>
                        ) : (
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                            </svg>
                        )}
                    </button>
                </div>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <h1 className="text-2xl lg:text-4xl font-bold mb-4">
                        {festivalData.title}
                    </h1>
                    <h2 className="text-xl lg:text-3xl mb-4">
                        {festivalData.subtitle}
                    </h2>
                </CardContent>
            </Card>

            <IntroductionSection data={festivalData.introduction} />
            <Separator className="my-13" />
            <SpeakersSection data={festivalData.speakers} />
            <CallToParticipateSection data={festivalData.callToParticipate} />
            <Separator className="my-12" />
            <KeyActivitiesSection data={festivalData.keyActivities} />
            <Separator className="my-12" />
        </div>
    );
}

function IntroductionSection({ data }) {
    if (!data) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-4xl font-bold text-orange-900">
                    {data.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-lg whitespace-pre-line">{data.content}</p>
            </CardContent>
        </Card>
    );
}

function CallToParticipateSection({ data }) {
    if (!data) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-4xl font-bold text-orange-900">
                    {data.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <h3 className="text-3xl font-semibold mb-6">{data.subtitle}</h3>
                <p className="text-lg mb-8">{data.content}</p>

                <div className="space-y-8">
                    {data.workshops && (
                        <div>
                            <h4 className="text-2xl font-semibold mb-4">
                                {data.workshops.title}
                            </h4>
                            <p className="text-lg mb-4">
                                {data.workshops.content}
                            </p>
                            {data.workshops.opportunities && (
                                <ul className="list-disc pl-6 mb-4 space-y-2 text-lg">
                                    {data.workshops.opportunities.map(
                                        (item, index) => (
                                            <li key={index}>{item}</li>
                                        )
                                    )}
                                </ul>
                            )}
                            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                                <p className="font-semibold text-lg text-orange-900">
                                    How to Apply:
                                </p>
                                <p className="text-lg mb-4">
                                    {data.workshops.howToApply.benefits}
                                </p>
                                <a
                                    href={data.workshops.howToApply.link}
                                    className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Click here to apply
                                </a>
                            </div>
                        </div>
                    )}

                    {data.callForArtists && (
                        <div>
                            <h4 className="text-2xl font-semibold mb-4">
                                {data.callForArtists.title}
                            </h4>
                            <p className="text-lg mb-4">
                                {data.callForArtists.content}
                            </p>
                            <p className="font-semibold text-lg">
                                Areas of Interest:
                            </p>
                            {data.callForArtists.areasOfInterest && (
                                <ul className="list-disc pl-6 mb-4 space-y-2 text-lg">
                                    {data.callForArtists.areasOfInterest.map(
                                        (item, index) => (
                                            <li key={index}>{item}</li>
                                        )
                                    )}
                                </ul>
                            )}
                            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                                <p className="font-semibold text-lg text-orange-900">
                                    How to Apply:
                                </p>
                                <p className="text-lg">
                                    {data.callForArtists.howToApply}
                                </p>
                            </div>
                        </div>
                    )}

                    {data.callForVolunteers && (
                        <div>
                            <h4 className="text-2xl font-semibold mb-4">
                                {data.callForVolunteers.title}
                            </h4>
                            <p className="text-lg mb-4">
                                {data.callForVolunteers.content}
                            </p>

                            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                                <p className="font-semibold text-lg text-orange-900">
                                    How to Apply:
                                </p>
                                <p className="text-lg">
                                    {data.callForVolunteers.howToApply}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function KeyActivitiesSection({ data }) {
    if (!data || !data.activities) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-4xl font-bold text-orange-900">
                    {data.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-12">
                    {data.activities.map((activity, index) => (
                        <div key={index}>
                            <h3 className="text-3xl font-semibold mb-4">
                                {activity.title}
                            </h3>
                            <p className="text-lg mb-6">{activity.content}</p>
                            {activity.highlights && (
                                <div className="space-y-6">
                                    {activity.highlights.map(
                                        (highlight, hIndex) => (
                                            <div key={hIndex}>
                                                <h4 className="text-2xl font-semibold mb-2">
                                                    {highlight.title}
                                                </h4>
                                                <ul className="list-disc pl-6 space-y-2 text-lg">
                                                    {highlight.items &&
                                                        highlight.items.map(
                                                            (item, iIndex) => (
                                                                <li
                                                                    key={iIndex}
                                                                >
                                                                    {item}
                                                                </li>
                                                            )
                                                        )}
                                                </ul>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                            {activity.themes && (
                                <div>
                                    <h4 className="text-2xl font-semibold mb-2">
                                        Exhibition Themes:
                                    </h4>
                                    <ul className="list-disc pl-6 space-y-2 text-lg">
                                        {activity.themes.map(
                                            (theme, tIndex) => (
                                                <li key={tIndex}>{theme}</li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                            {activity.panelTopics && (
                                <div>
                                    <h4 className="text-2xl font-semibold mb-2">
                                        Panel Topics:
                                    </h4>
                                    <ul className="list-disc pl-6 space-y-2 text-lg">
                                        {activity.panelTopics.map(
                                            (topic, tIndex) => (
                                                <li key={tIndex}>{topic}</li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function SpeakersSection({ data }) {
    const [selectedSpeaker, setSelectedSpeaker] = useState(null);

    if (!data) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-4xl font-bold text-orange-900">
                    Featured Speakers
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {data.map((speaker, index) => (
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
                                    className="object-cover rounded-lg object-top"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-center">
                                {speaker.name}
                            </h3>
                            <p className="text-center text-gray-600">
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
                            <DialogTitle className="text-2xl font-bold mb-2">
                                {selectedSpeaker.name}
                                {selectedSpeaker.alias && (
                                    <span className="text-orange-600 block text-lg">
                                        "{selectedSpeaker.alias}"
                                    </span>
                                )}
                            </DialogTitle>
                            <DialogDescription className="text-lg text-orange-600 font-medium">
                                {selectedSpeaker.role}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col md:flex-row gap-6 p-4">
                            <div className="md:w-1/3 flex-shrink-0">
                                <div className="aspect-[3/4] relative rounded-lg overflow-hidden object-top shadow-lg">
                                    <Image
                                        src={
                                            selectedSpeaker.image ||
                                            "/placeholder.svg"
                                        }
                                        alt={selectedSpeaker.name}
                                        fill
                                        className="object-cover"
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
                                                <Globe className="h-5 w-5" />
                                                <span>Website</span>
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
                                                <BookOpen className="h-5 w-5" />
                                                <span>Blog</span>
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
                                                <Link className="h-5 w-5" />
                                                <span>Links</span>
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="md:w-2/3">
                                <div className="prose prose-orange max-w-none">
                                    <p className="whitespace-pre-line text-gray-700">
                                        {selectedSpeaker.bio}
                                    </p>
                                    {selectedSpeaker.workshop && (
                                        <div className="mt-4">
                                            <h4 className="text-xl font-semibold text-orange-900">
                                                {selectedSpeaker.workshop.title}
                                            </h4>
                                            <p className="text-gray-700">
                                                {
                                                    selectedSpeaker.workshop
                                                        .description
                                                }
                                            </p>
                                            {selectedSpeaker.workshop
                                                .learning_outcomes && (
                                                <div className="mt-2">
                                                    <strong>
                                                        What you'll learn:
                                                    </strong>
                                                    <ul>
                                                        {selectedSpeaker.workshop.learning_outcomes.map(
                                                            (
                                                                outcome,
                                                                index
                                                            ) => (
                                                                <li key={index}>
                                                                    {outcome}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {selectedSpeaker.credentials && (
                                        <div className="mt-4">
                                            {selectedSpeaker.credentials
                                                .title && (
                                                <p className="font-semibold text-orange-900">
                                                    {
                                                        selectedSpeaker
                                                            .credentials.title
                                                    }
                                                </p>
                                            )}
                                            {selectedSpeaker.credentials
                                                .education && (
                                                <div className="mt-2">
                                                    <strong>Education:</strong>
                                                    <ul>
                                                        {selectedSpeaker.credentials.education.map(
                                                            (edu, index) => (
                                                                <li key={index}>
                                                                    {edu}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
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
