import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import homeData from "./data/home.json";
import festivalsData from "./data/festivals.json";
import workshopsData from "./data/workshops.json";
import { GalleryModal } from "../components/GalleryModal";
import { PressCoverage } from "../components/PressCoverage";
import { SponsorCarousel } from "../components/SponsorCarousel";
import { SlideIn } from "../components/SlideIn";

export default function Home() {
    const upcomingEvent =
        new Date(homeData.eventDate) > new Date() ? "festival" : "workshop";
    const eventDate = new Date(homeData.eventDate);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero with countdown */}
            <SlideIn>
                <section className="relative text-center py-20 mb-12 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-75"></div>
                    <Image
                        src="/hero-image.jpg"
                        alt="Tech Festival Hero"
                        layout="fill"
                        objectFit="cover"
                        className="absolute inset-0 z-0"
                    />
                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold mb-4 text-white">
                            {homeData.heroTitle}
                        </h1>
                        <p className="text-xl mb-8 text-white">
                            {homeData.heroSubtitle}
                        </p>
                        <div className="text-6xl font-bold mb-8 text-white">
                            <CountdownTimer targetDate={eventDate} />
                        </div>
                        <Button
                            size="lg"
                            className="bg-accent text-accent-foreground hover:bg-accent"
                        >
                            Register Now
                        </Button>
                    </div>
                </section>
            </SlideIn>

            {/* Sponsors Carousel */}
            <SlideIn direction="right" delay={0.2}>
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-center">
                        Our Sponsors
                    </h2>
                    <SponsorCarousel sponsors={homeData.sponsors} />
                </section>
            </SlideIn>

            {/* About Festival */}
            <SlideIn direction="left" delay={0.3}>
                <section className="mb-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-accent">
                                About the Festival
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{homeData.aboutFestival}</p>
                        </CardContent>
                    </Card>
                </section>
            </SlideIn>

            {/* Previous Festivals */}
            <SlideIn direction="right" delay={0.4}>
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">
                        Previous Festivals
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(festivalsData).map(
                            ([year, festival], index) => (
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
                                                className="rounded-lg mb-4"
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
                            )
                        )}
                    </div>
                </section>
            </SlideIn>

            {/* About Workshop */}
            <SlideIn direction="left" delay={0.5}>
                <section className="mb-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-accent">
                                About the Workshop
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{homeData.aboutWorkshop}</p>
                        </CardContent>
                    </Card>
                </section>
            </SlideIn>

            {/* Previous Workshops */}
            <SlideIn direction="right" delay={0.6}>
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">
                        Previous Workshops
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(workshopsData).map(
                            ([year, workshop], index) => (
                                <SlideIn
                                    key={year}
                                    direction="up"
                                    delay={0.1 * index}
                                >
                                    <Card className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <CardTitle>
                                                {workshop.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Image
                                                src={
                                                    workshop.thumbnail ||
                                                    "/placeholder.svg"
                                                }
                                                alt={workshop.title}
                                                width={300}
                                                height={200}
                                                className="rounded-lg mb-4"
                                            />
                                            <p className="line-clamp-3">
                                                {workshop.brief}
                                            </p>
                                            <Link
                                                href={`/workshop/${year}`}
                                                className="text-accent hover:underline mt-2 inline-block"
                                            >
                                                Learn more
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </SlideIn>
                            )
                        )}
                    </div>
                </section>
            </SlideIn>

            {/* Press Coverage */}
            <SlideIn direction="left" delay={0.7}>
                <PressCoverage articles={homeData.pressAppearances} />
            </SlideIn>

            {/* Call to Collaborators */}
            <SlideIn direction="right" delay={0.8}>
                <section className="mb-12 bg-accent/10 p-8 rounded-lg">
                    <h2 className="text-3xl font-bold mb-4 text-accent">
                        {homeData.callToAction.title}
                    </h2>
                    <p className="mb-6">{homeData.callToAction.description}</p>
                    <Button className="bg-accent text-accent-foreground hover:bg-accent">
                        {homeData.callToAction.buttonText}
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
                                        className="rounded-lg object-cover w-full h-full"
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
    return <div>00:00:00:00</div>;
}
