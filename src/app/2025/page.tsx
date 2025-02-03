import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
                        src="https://i.ibb.co/vsg2JHj/Whats-App-Image-2025-01-27-at-13-23-35.jpg"
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
            <CallToParticipateSection data={festivalData.callToParticipate} />
            <Separator className="my-12" />
            <KeyActivitiesSection data={festivalData.keyActivities} />
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
                                <p className="text-lg">
                                    {data.workshops.howToApply}
                                </p>
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
