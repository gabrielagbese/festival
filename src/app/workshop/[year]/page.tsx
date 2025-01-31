import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import workshopsData from "../../data/workshops.json";

export default function WorkshopYear({ params }: { params: { year: string } }) {
    const workshops = workshopsData[params.year];

    if (!workshops || workshops.length === 0) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">
                {params.year} Workshops
            </h1>
            {workshops.map((workshop) => (
                <Card key={workshop.id} className="mb-12">
                    <CardHeader>
                        <CardTitle className="text-3xl">
                            {workshop.title}
                        </CardTitle>
                        <p className="text-lg text-muted-foreground">
                            {new Date(workshop.date).toLocaleDateString()}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Brief */}
                            <div>
                                <h3 className="text-2xl font-semibold mb-2">
                                    About the Workshop
                                </h3>
                                <p>{workshop.brief}</p>
                            </div>

                            {/* Speakers */}
                            <div>
                                <h3 className="text-2xl font-semibold mb-4">
                                    Speakers
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
                                    {workshop.speakers.map((speaker, index) => (
                                        <Card key={index}>
                                            <CardContent className="pt-6">
                                                <Image
                                                    src={
                                                        speaker.image ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={speaker.name}
                                                    width={100}
                                                    height={100}
                                                    className="rounded-full mx-auto mb-4"
                                                />
                                                <h4 className="text-xl font-semibold text-center">
                                                    {speaker.name}
                                                </h4>
                                                <p className="text-center text-muted-foreground">
                                                    {speaker.bio}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Images */}
                            {/* <div>
                                <h3 className="text-2xl font-semibold mb-4">
                                    Gallery
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {workshop.images.map((image, index) => (
                                        <Image
                                            key={index}
                                            src={
                                                image.src || "/placeholder.svg"
                                            }
                                            alt={image.alt}
                                            width={500}
                                            height={300}
                                            className="rounded-lg object-cover w-full h-64"
                                        />
                                    ))}
                                </div>
                            </div> */}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
