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
import workshopsData from "../../data/workshops.json";
import { GalleryModal } from "../../../components/GalleryModal";
import { HighlightModal } from "../../../components/HighlightModal";
import { PressCoverage } from "../../../components/PressCoverage";
import { SlideIn } from "../../../components/SlideIn";

export default function Workshop({ params }: { params: { year: string } }) {
    const workshop = workshopsData[params.year];

    if (!workshop) {
        notFound();
    }

    const isPastEvent = new Date(workshop.date) < new Date();

    return (
        <div className="container mx-auto px-4 py-8">
            <SlideIn>
                <section className="text-center py-12 bg-gradient-to-r from-orange-600 to-orange-400 rounded-lg mb-12">
                    <h1 className="text-4xl font-bold mb-4 text-white">
                        {workshop.title}
                    </h1>
                    {isPastEvent ? (
                        <div className="text-2xl font-bold mb-8 text-white">
                            Event Date:{" "}
                            {new Date(workshop.date).toLocaleDateString()}
                        </div>
                    ) : (
                        <>
                            <div className="text-6xl font-bold mb-8 text-white">
                                <CountdownTimer
                                    targetDate={new Date(workshop.date)}
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
                        <CardTitle>Workshop Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            <strong>Location:</strong> {workshop.location}
                        </p>
                        <p>
                            <strong>Theme:</strong> {workshop.theme}
                        </p>
                        <p>
                            <strong>Brief:</strong> {workshop.brief}
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* Days (in tabs) */}
            <section className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Workshop Schedule</h2>
                <Tabs defaultValue={workshop.schedule[0].day}>
                    <TabsList>
                        {workshop.schedule.map((day) => (
                            <TabsTrigger key={day.day} value={day.day}>
                                {day.day}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {workshop.schedule.map((day) => (
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
                                                    Speaker: {session.speaker}
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
                    {workshop.speakers.map((speaker, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <Image
                                    src={speaker.image || "/placeholder.svg"}
                                    alt={speaker.name}
                                    width={100}
                                    height={100}
                                    className="rounded-full"
                                />
                                <CardTitle>{speaker.name}</CardTitle>
                                <CardDescription>{speaker.bio}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-4">
                                    <a
                                        href={speaker.socials.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="outline" size="sm">
                                            Twitter
                                        </Button>
                                    </a>
                                    <a
                                        href={speaker.socials.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button variant="outline" size="sm">
                                            LinkedIn
                                        </Button>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {isPastEvent && (
                <>
                    {/* Event specific highlights */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold mb-6">
                            Event Highlights
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {workshop.highlights.map((highlight, index) => (
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
                                                width={100}
                                                height={100}
                                                className="rounded-lg mb-2"
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

                    {/* General gallery */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold mb-6">Gallery</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {workshop.gallery.map((item, index) => (
                                <GalleryModal
                                    key={index}
                                    images={workshop.gallery}
                                    initialSlide={index}
                                >
                                    <div className="cursor-pointer">
                                        <Image
                                            src={
                                                item.image || "/placeholder.svg"
                                            }
                                            alt={item.alt}
                                            width={300}
                                            height={300}
                                            className="rounded-lg object-cover w-full h-full"
                                        />
                                    </div>
                                </GalleryModal>
                            ))}
                        </div>
                    </section>

                    {/* Mentions in press */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold mb-6">
                            Press Coverage
                        </h2>
                        <PressCoverage articles={workshop.pressCoverage} />
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
