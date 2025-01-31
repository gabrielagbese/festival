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

export default function Festival({ params }: { params: { year: string } }) {
    const festival = festivalsData[params.year];

    if (!festival) {
        notFound();
    }

    const isPastEvent = new Date(festival.date) < new Date();

    return (
        <div className="container mx-auto px-4 py-8">
            <SlideIn>
                <section className="text-center py-12 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg mb-12">
                    <h1 className="text-4xl font-bold mb-4 text-white">
                        {festival.title}
                    </h1>
                    {isPastEvent ? (
                        <div className="text-2xl font-bold mb-8 text-white">
                            Event Date:{" "}
                            {new Date(festival.date).toLocaleDateString()}
                        </div>
                    ) : (
                        <>
                            <div className="text-6xl font-bold mb-8 text-white">
                                <CountdownTimer
                                    targetDate={new Date(festival.date)}
                                />
                            </div>
                            <Button
                                size="lg"
                                className="bg-accent text-accent-foreground hover:bg-accent/90"
                            >
                                Register Now
                            </Button>
                        </>
                    )}
                </section>
            </SlideIn>

            {/* Location, Theme, Brief */}
            <section className="mb-12">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl">
                            Festival Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg">
                            <strong>Location:</strong> {festival.location}
                        </p>
                        <p className="text-lg">
                            <strong>Theme:</strong> {festival.theme}
                        </p>
                        <p className="text-lg">
                            <strong>Brief:</strong> {festival.brief}
                        </p>
                    </CardContent>
                </Card>
            </section>

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
