"use client";
import Image from "next/image";
import {
    Globe,
    BookOpen,
    Link,
} from "lucide-react";
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
import workshopData from "../../data/2026-workshop.json";

export default function Workshop2026() {
    const [selectedSpeaker, setSelectedSpeaker] = useState(null);

    if (!workshopData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <Card className="overflow-hidden flex flex-col lg:flex-row items-center">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                    <h1 className="text-xl lg:text-2xl font-bold mb-2">
                        {workshopData.title}
                    </h1>
                    <h2 className="text-base lg:text-lg text-muted-foreground">
                        {workshopData.subtitle}
                    </h2>
                </CardContent>
            </Card>

            <IntroductionSection data={workshopData.introduction} />
            <Separator className="my-8" />
            <SpeakersSection
                data={workshopData.speakers}
                selectedSpeaker={selectedSpeaker}
                setSelectedSpeaker={setSelectedSpeaker}
            />
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
                <CardTitle className="text-2xl font-bold">
                    {data.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-base whitespace-pre-line">{data.content}</p>
            </CardContent>
        </Card>
    );
}

function SpeakersSection({ data, selectedSpeaker, setSelectedSpeaker }) {
    if (!data) {
        return null;
    }

    if (!Array.isArray(data)) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-bold">
                    Workshop Speakers
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                                        What you&apos;ll learn:
                                                    </strong>
                                                    <ul>
                                                        {selectedSpeaker.workshop.learning_outcomes.map(
                                                            (
                                                                outcome,
                                                                index,
                                                            ) => (
                                                                <li key={index}>
                                                                    {outcome}
                                                                </li>
                                                            ),
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
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {selectedSpeaker.expertise && (
                                        <div className="mt-4">
                                            <strong>Expertise:</strong>
                                            <ul>
                                                {selectedSpeaker.expertise.map(
                                                    (item, index) => (
                                                        <li key={index}>
                                                            {item}
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
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
