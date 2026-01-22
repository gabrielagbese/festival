import Image from "next/image";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import festivalsData from "../../data/festivals.json";
import { GalleryModal } from "../../../components/GalleryModal";
import { HighlightModal } from "../../../components/HighlightModal";
import { ExhibitionModal } from "../../../components/ExhibitionModal";
import { PressCoverage } from "../../../components/PressCoverage";
import { SlideIn } from "../../../components/SlideIn";

export default async function Festival({ params }: { params: Promise<{ year: string }> }) {
    const { year } = await params;
    const festival = festivalsData[year];

    if (!festival) {
        notFound();
    }

    const isPastEvent = new Date(festival.date) < new Date();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section - Redesigned */}
            <SlideIn>
                <section className="mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                        {/* Left: Image */}
                        <div className="relative">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800">
                                <Image
                                    src={festival.flyer}
                                    alt={festival.title}
                                    fill
                                    className="object-cover"
                                    unoptimized={true}
                                />
                                {/* Status Badge */}
                                <div className="absolute top-4 left-4">
                                    <span
                                        className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                                            isPastEvent
                                                ? "bg-zinc-900/80 text-white"
                                                : "bg-orange-500 text-white"
                                        }`}
                                    >
                                        {isPastEvent
                                            ? "Past Event"
                                            : "Upcoming"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Content */}
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-4">
                                <Image
                                    src="/logo.png"
                                    alt="Cavic Logo"
                                    width={48}
                                    height={48}
                                    className="rounded-lg"
                                />
                                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                    Cavic Festival
                                </span>
                            </div>

                            <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-white tracking-tight">
                                {festival.title}
                            </h1>

                            <div className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg mb-6 w-fit">
                                <span className="font-medium">Theme:</span>{" "}
                                {festival.theme}
                            </div>

                            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                                {festival.brief}
                            </p>

                            {/* Date & Location Cards */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                                        Date
                                    </div>
                                    <div className="font-semibold text-zinc-900 dark:text-white">
                                        {new Date(
                                            festival.date,
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                </div>
                                <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">
                                        Location
                                    </div>
                                    <div className="font-semibold text-zinc-900 dark:text-white">
                                        {festival.location}
                                    </div>
                                </div>
                            </div>

                            {!isPastEvent && (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="bg-orange-500 text-white px-6 py-3 rounded-xl text-center">
                                        <div className="text-sm opacity-90">
                                            Countdown
                                        </div>
                                        <div className="text-xl font-bold">
                                            <CountdownTimer
                                                targetDate={
                                                    new Date(festival.date)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        size="lg"
                                        className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 rounded-lg px-8 h-12"
                                    >
                                        Register Now
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </SlideIn>

            {/* Days (in tabs) */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Festival Schedule</h2>
                <Tabs defaultValue={festival.schedule[0].day}>
                    <TabsList>
                        {festival.schedule.map((day) => (
                            <TabsTrigger key={day.day} value={day.day}>
                                {day.day}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {festival.schedule.map((day) => (
                        <TabsContent key={day.day} value={day.day}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{day.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-4">
                                        {day.sessions.map((session, index) => (
                                            <li key={index}>
                                                <p>
                                                    <strong>
                                                        {session.time}
                                                    </strong>
                                                    : {session.title}
                                                </p>
                                                <p>
                                                    Location: {session.location}
                                                </p>
                                                <p>{session.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </section>

            {/* Speakers section */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Featured Speakers</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {festival.speakers.map((speaker, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <Image
                                    src={speaker.image || "/placeholder.svg"}
                                    alt={speaker.name}
                                    width={100}
                                    height={100}
                                    className="rounded-full object-cover aspect-square object-[center_top]"
                                />
                                <CardTitle>{speaker.name}</CardTitle>
                                <CardDescription>{speaker.bio}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section>

            {/* <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Featured Performers</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {festival.artists.map((artist, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <Image
                                    src={artist.image || "/placeholder.svg"}
                                    alt={artist.name}
                                    width={100}
                                    height={100}
                                    className="rounded-full"
                                />
                                <CardTitle>{artist.name}</CardTitle>
                                <CardDescription>{artist.bio}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section> */}

            {isPastEvent && (
                <>
                    {/* Event specific highlights */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold mb-6">
                            Event Highlights
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {festival.highlights.map((highlight, index) => (
                                <HighlightModal
                                    key={index}
                                    highlight={highlight}
                                >
                                    <Card className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
                                        <CardHeader>
                                            <Image
                                                src={
                                                    highlight.thumbnail ||
                                                    "/placeholder.svg"
                                                }
                                                alt={highlight.title}
                                                width={300}
                                                height={300}
                                                className=" rounded-sm brightness-120 border border-gray-500/40 shadow-md h-h-64 w-64 mb-2 aspect-square object-cover object-[center_top]"
                                            />
                                            <CardTitle>
                                                {highlight.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="line-clamp-2">
                                                {highlight.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </HighlightModal>
                            ))}
                        </div>
                    </section>

                    {/* Exhibition section */}
                    {/* <section className="mb-12">
                        <h2 className="text-3xl font-bold mb-6">Exhibitions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {festival.exhibitions.map((exhibition, index) => (
                                <ExhibitionModal
                                    key={index}
                                    exhibition={exhibition}
                                >
                                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                                        <CardHeader>
                                            <CardTitle>
                                                {exhibition.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Image
                                                src={
                                                    exhibition.image ||
                                                    "/placeholder.svg"
                                                }
                                                alt={exhibition.name}
                                                width={400}
                                                height={300}
                                                className="rounded-lg mb-4"
                                            />
                                            <p>{exhibition.description}</p>
                                        </CardContent>
                                    </Card>
                                </ExhibitionModal>
                            ))}
                        </div>
                    </section> */}

                    {/* General gallery */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold mb-6">Gallery</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {festival.gallery.map((item, index) => (
                                <GalleryModal
                                    key={index}
                                    images={festival.gallery}
                                    initialSlide={index}
                                >
                                    <div className="cursor-pointer aspect-square">
                                        <Image
                                            src={
                                                item.image || "/placeholder.svg"
                                            }
                                            alt={item.alt}
                                            width={500}
                                            height={500}
                                            className="rounded-lg object-cover w-full h-full"
                                        />
                                    </div>
                                </GalleryModal>
                            ))}
                        </div>
                    </section>

                    {/* Mentions in press */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold mb-6"></h2>
                        <PressCoverage articles={festival.pressCoverage} />
                    </section>
                </>
            )}
        </div>
    );
}

function CountdownTimer({ targetDate }) {
    // Implement countdown logic here
    return <div>00:00:00:00</div>;
}
