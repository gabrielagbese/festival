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
import { useState } from "react";
import festivalData from "../data/2025.json";

export default function CavicFestival2025() {
    if (!festivalData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-12">
            <Card
                className="bg-gradient-to-r from-orange-600 to-orange-400 overflow-hidden text-white 
      flex flex-col lg:flex-row items-center "
            >
                <div className="relative h-64 w-[100%] lg:h-80 lg:w-80 p-2 flex justify-center items-center rounded-lg overflow-clip">
                    <Image
                        src="https://i.ibb.co/S465WfDy/Whats-App-Image-2025-02-04-at-14-56-06.jpg"
                        alt="Cavic Festival 2025"
                        layout="fill"
                        className="p-4 object-cover rounded-lg"
                        objectFit="cover"
                    />
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
            <Separator className="my-12" />
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
