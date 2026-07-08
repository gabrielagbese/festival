"use client";

import Image from "next/image";
import Link from "next/link";
import {
    type ComponentProps,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { RowsPhotoAlbum } from "react-photo-album";
import type {
    ClickHandlerProps,
    Photo,
    RenderButtonContext,
    RenderPhotoContext,
} from "@/vendor/react-photo-album/dist/types";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import {
    ArrowUpRight,
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Play,
} from "lucide-react";
import festivalsData from "../data/festivals.json";
import homeData from "../data/home.json";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

type FestivalYear = keyof typeof festivalsData;
type Festival = (typeof festivalsData)[FestivalYear];
type GalleryFilter = "All" | "Photos" | "Videos" | "Activities" | "Exhibits";

type MediaItem = {
    id: string;
    title: string;
    description: string;
    year: string;
    image: string;
    kind: Exclude<GalleryFilter, "All">;
    video?: string;
    images?: string[];
    location?: string;
};

type GalleryPhoto = Photo & {
    key: string;
    year: string;
    mediaItem: MediaItem;
};

type HeroSlide = {
    image: string;
    title: string;
    year: string;
};

const filters: GalleryFilter[] = [
    "All",
    "Photos",
    "Videos",
    "Activities",
    "Exhibits",
];

const allTabOrder: Record<MediaItem["kind"], number> = {
    Videos: 0,
    Photos: 1,
    Activities: 2,
    Exhibits: 3,
};

const dotTexture = {
    backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23d4d4d4' fill-opacity='0.4'/%3E%3C/svg%3E\")",
    backgroundRepeat: "repeat",
};

const siteImages = [
    homeData.heroImage,
    ...homeData.gallery.map((item) => item.image),
    ...Object.values(festivalsData).flatMap((festival) => [
        festival.thumbnail,
        festival.flyer,
        ...festival.gallery.map((item) => item.image),
        ...festival.highlights.flatMap((highlight) => [
            highlight.thumbnail,
            ...highlight.images,
        ]),
    ]),
].filter(Boolean);

const fallbackImage = siteImages[0] || "/logo.png";

const getFestivalImage = (festival: Festival, index = 0) =>
    festival.gallery[index]?.image ||
    festival.gallery[0]?.image ||
    festival.thumbnail ||
    festival.flyer ||
    fallbackImage;

const toGalleryPhoto = (item: MediaItem): GalleryPhoto => ({
    key: item.id,
    src: item.image,
    width: 1600,
    height: 1200,
    alt: `${item.year} Cavic Festival photo`,
    year: item.year,
    mediaItem: item,
});

const activityKeywords = [
    "workshop",
    "panel",
    "performance",
    "open mic",
    "networking",
    "opening",
    "masterclass",
];

const getHeroSlides = (): HeroSlide[] => {
    const archiveSlides = (
        Object.entries(festivalsData) as [FestivalYear, Festival][]
    )
        .sort(([a], [b]) => Number(b) - Number(a))
        .flatMap(([year, festival]) =>
            festival.gallery.slice(0, 2).map((item) => ({
                image: item.image,
                title: festival.title,
                year,
            })),
        );

    const homeSlides = homeData.gallery.slice(0, 3).map((item) => ({
        image: item.image,
        title: item.alt,
        year: item.alt.match(/\d{4}/)?.[0] || "Archive",
    }));

    return [...archiveSlides, ...homeSlides].slice(0, 8);
};

function buildItems(): MediaItem[] {
    return (Object.entries(festivalsData) as [FestivalYear, Festival][])
        .sort(([a], [b]) => Number(b) - Number(a))
        .flatMap(([year, festival]) => {
            const photos: MediaItem[] = festival.gallery
                .slice(0, 12)
                .map((photo, index) => ({
                    id: `${year}-photo-${index}`,
                    title: festival.title,
                    description: "",
                    year,
                    image: photo.image,
                    kind: "Photos",
                    location: festival.location,
                }));

            const videos: MediaItem[] = festival.highlights
                .filter((highlight) => Boolean(highlight.video))
                .map((highlight, index) => ({
                    id: `${year}-video-${index}`,
                    title: highlight.title,
                    description: highlight.description,
                    year,
                    image:
                        highlight.thumbnail ||
                        highlight.images[0] ||
                        getFestivalImage(festival, index),
                    kind: "Videos",
                    images: highlight.images,
                    video: highlight.video,
                    location: festival.location,
                }));

            const activities: MediaItem[] = festival.schedule
                .flatMap((day) => day.sessions)
                .filter((session) => {
                    const text = `${session.title} ${session.description}`.toLowerCase();
                    return activityKeywords.some((keyword) =>
                        text.includes(keyword),
                    );
                })
                .slice(0, 3)
                .map((session, index) => ({
                    id: `${year}-activity-${index}`,
                    title: session.title,
                    description: session.description,
                    year,
                    image: getFestivalImage(festival, index),
                    kind: "Activities",
                    location: festival.location,
                }));

            const exhibits: MediaItem[] = festival.highlights
                .filter((highlight) => !highlight.video)
                .map((highlight, index) => ({
                    id: `${year}-exhibit-${index}`,
                    title: highlight.title,
                    description: highlight.description,
                    year,
                    image:
                        highlight.thumbnail ||
                        highlight.images[0] ||
                        getFestivalImage(festival, index),
                    kind: "Exhibits",
                    images: highlight.images,
                    location: festival.location,
                }));

            return [...videos, ...photos, ...activities, ...exhibits];
        });
}

type GalleryImageProps = Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
    src: string;
    alt: string;
    fallbackSrc?: string;
};

function GalleryImage({
    src,
    alt,
    className = "",
    fallbackSrc = fallbackImage,
    onLoad,
    onError,
    ...props
}: GalleryImageProps) {
    const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setCurrentSrc(src || fallbackSrc);
        setLoaded(false);
    }, [fallbackSrc, src]);

    return (
        <>
            {!loaded && (
                <span
                    aria-hidden="true"
                    className="absolute inset-0 animate-pulse bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900"
                />
            )}
            <Image
                {...props}
                src={currentSrc}
                alt={alt}
                className={`${className} transition-opacity duration-300 ${
                    loaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={(event) => {
                    setLoaded(true);
                    onLoad?.(event);
                }}
                onError={(event) => {
                    if (currentSrc !== fallbackSrc) {
                        setCurrentSrc(fallbackSrc);
                        setLoaded(false);
                    } else {
                        setLoaded(true);
                    }
                    onError?.(event);
                }}
            />
        </>
    );
}

function HeroSlider({ slides }: { slides: HeroSlide[] }) {
    const [current, setCurrent] = useState(0);
    const slide = slides[current] || {
        image: fallbackImage,
        title: "Cavic Festival Gallery",
        year: "Archive",
    };

    const goTo = (nextIndex: number) => {
        setCurrent((nextIndex + slides.length) % slides.length);
    };

    useEffect(() => {
        if (slides.length < 2) return;
        const timer = window.setInterval(() => {
            setCurrent((value) => (value + 1) % slides.length);
        }, 5500);
        return () => window.clearInterval(timer);
    }, [slides.length]);

    return (
        <section className="mb-8 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 shadow-sm dark:border-zinc-800">
            <div className="relative min-h-[360px] sm:min-h-[430px]">
                <GalleryImage
                    key={slide.image}
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                            Gallery
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                            Activities, exhibits, images and video from Cavic
                            Festival.
                        </p>
                    </div>
                </div>
                {slides.length > 1 && (
                    <>
                        <button
                            type="button"
                            aria-label="Previous slide"
                            onClick={() => goTo(current - 1)}
                            className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-zinc-950 shadow-sm transition hover:bg-white"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            aria-label="Next slide"
                            onClick={() => goTo(current + 1)}
                            className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-zinc-950 shadow-sm transition hover:bg-white"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-5 right-5 hidden gap-2 sm:flex">
                            {slides.map((item, index) => (
                                <button
                                    key={`${item.image}-${index}`}
                                    type="button"
                                    aria-label={`Show slide ${index + 1}`}
                                    onClick={() => goTo(index)}
                                    className={`h-2.5 rounded-full transition ${
                                        index === current
                                            ? "w-8 bg-orange-500"
                                            : "w-2.5 bg-white/70"
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

function DetailDialog({
    item,
    children,
}: {
    item: MediaItem;
    children: React.ReactNode;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-h-[92vh] overflow-hidden border-zinc-200 p-0 sm:max-w-[1040px] dark:border-zinc-800">
                <div className="grid max-h-[92vh] bg-white dark:bg-zinc-950 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-start">
                    <div className="self-start border-b border-zinc-200 bg-zinc-950 dark:border-zinc-800 lg:border-b-0 lg:border-r">
                        {item.video ? (
                            <div className="aspect-video w-full overflow-hidden bg-black">
                                <iframe
                                    className="h-full w-full"
                                    src={item.video}
                                    title={item.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <GalleryImage
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    sizes="(min-width: 1024px) 56vw, 100vw"
                                    className="object-cover"
                                />
                            </div>
                        )}
                        {item.images && item.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 bg-zinc-950 p-3">
                                {item.images.slice(0, 4).map((image, index) => (
                                    <div
                                        key={`${item.id}-${index}`}
                                        className="relative aspect-[4/3] overflow-hidden rounded-md bg-zinc-900"
                                    >
                                        <GalleryImage
                                            src={image}
                                            alt={`${item.title} ${index + 1}`}
                                            fill
                                            sizes="120px"
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <DialogHeader className="max-h-[92vh] space-y-5 overflow-y-auto p-6 text-left sm:p-8">
                        <span className="w-fit rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-bold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                            {item.year}
                        </span>
                        <div>
                            <DialogTitle className="text-2xl font-black leading-tight text-zinc-950 dark:text-white sm:text-3xl">
                                {item.title}
                            </DialogTitle>
                            <DialogDescription className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
                                {item.description}
                            </DialogDescription>
                        </div>
                        <div className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                <CalendarDays className="h-4 w-4 text-orange-600" />
                                Cavic Festival {item.year}
                            </div>
                            {item.location && (
                                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                                    <MapPin className="h-4 w-4 text-orange-600" />
                                    {item.location}
                                </div>
                            )}
                        </div>
                        <Button
                            asChild
                            className="w-fit rounded-md bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                        >
                            <Link href={`/festival/${item.year}`}>
                                View edition
                                <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </DialogHeader>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function PhotoGalleryGrid({ items }: { items: MediaItem[] }) {
    const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);
    const photos = useMemo(() => items.map(toGalleryPhoto), [items]);
    const slides = useMemo(
        () =>
            photos.map((photo) => ({
                src: photo.src,
                width: photo.width,
                height: photo.height,
                alt: photo.alt,
            })),
        [photos],
    );

    useEffect(() => {
        const lightbox = new PhotoSwipeLightbox({
            dataSource: slides,
            pswpModule: () => import("photoswipe"),
            bgOpacity: 0.96,
            showHideAnimationType: "fade",
            wheelToZoom: true,
            preload: [1, 2],
            paddingFn: () => ({
                top: 32,
                bottom: 32,
                left: 24,
                right: 24,
            }),
        });

        lightbox.init();
        lightboxRef.current = lightbox;

        return () => {
            lightbox.destroy();
            lightboxRef.current = null;
        };
    }, [slides]);

    if (photos.length === 0) {
        return (
            <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                No images in this view yet.
            </div>
        );
    }

    return (
        <div
            data-gallery-kind="Photos"
            className="overflow-hidden rounded-lg border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-3"
        >
            <RowsPhotoAlbum
                photos={photos}
                targetRowHeight={(containerWidth: number | undefined) => {
                    const width = containerWidth ?? 1160;
                    return width < 640 ? 180 : width < 1024 ? 220 : 260;
                }}
                rowConstraints={(containerWidth: number | undefined) => ({
                    minPhotos: (containerWidth ?? 1160) < 640 ? 1 : 2,
                    maxPhotos: (containerWidth ?? 1160) < 640 ? 2 : 4,
                    singleRowMaxHeight: 260,
                })}
                spacing={8}
                padding={0}
                defaultContainerWidth={1160}
                sizes={{
                    size: "(min-width: 1280px) 1120px, calc(100vw - 32px)",
                }}
                onClick={({ event, index }: ClickHandlerProps<GalleryPhoto>) => {
                    event.preventDefault();
                    lightboxRef.current?.loadAndOpen(index);
                }}
                componentsProps={{
                    container: {
                        className: "cavic-photo-album",
                    },
                    button: ({ photo, index }: RenderButtonContext<GalleryPhoto>) => ({
                        className:
                            "group relative block h-full w-full overflow-hidden rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-950",
                        "aria-label": `Open ${photo.year} Cavic Festival photo ${index + 1}`,
                        onMouseEnter: () => lightboxRef.current?.preload(index),
                        onFocus: () => lightboxRef.current?.preload(index),
                    }),
                    image: {
                        loading: "lazy",
                        decoding: "async",
                        className: "react-photo-album--image",
                    },
                }}
                render={{
                    extras: (
                        _props: object,
                        { photo }: RenderPhotoContext<GalleryPhoto>,
                    ) => (
                        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-zinc-950 shadow-sm ring-1 ring-black/5">
                            {photo.year}
                        </span>
                    ),
                }}
            />
        </div>
    );
}

function TextMediaCard({ item }: { item: MediaItem }) {
    return (
        <DetailDialog item={item}>
            <button
                type="button"
                data-gallery-item={item.id}
                data-gallery-kind={item.kind}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
            >
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    <GalleryImage
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-zinc-950 shadow-sm">
                        {item.year}
                    </span>
                    {item.video && (
                        <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-orange-600 text-white shadow-sm">
                            <Play className="h-5 w-5 fill-current" />
                        </span>
                    )}
                </div>
                <div className="flex min-h-[128px] flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 text-lg font-bold leading-snug text-zinc-950 dark:text-white">
                        {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                        {item.description}
                    </p>
                </div>
            </button>
        </DetailDialog>
    );
}

export default function GalleryPage() {
    const [activeFilter, setActiveFilter] = useState<GalleryFilter>("All");
    const allItems = useMemo(() => buildItems(), []);
    const heroSlides = useMemo(() => getHeroSlides(), []);
    const filteredItems = allItems
        .filter((item) => activeFilter === "All" || item.kind === activeFilter)
        .sort((first, second) => {
            if (activeFilter !== "All") return 0;
            return allTabOrder[first.kind] - allTabOrder[second.kind];
        })
        .slice(0, activeFilter === "All" ? 30 : 42);
    const visiblePhotos = filteredItems.filter((item) => item.kind === "Photos");
    const visibleVideos = filteredItems.filter((item) => item.kind === "Videos");
    const visibleSupportItems = filteredItems.filter(
        (item) => item.kind === "Activities" || item.kind === "Exhibits",
    );
    const visibleTextItems =
        activeFilter === "All"
            ? visibleVideos
            : filteredItems.filter((item) => item.kind !== "Photos");
    const years = Object.keys(festivalsData).sort(
        (a, b) => Number(b) - Number(a),
    );

    useEffect(() => {
        window.history.scrollRestoration = "manual";
        window.scrollTo({ top: 0, left: 0 });
    }, []);

    return (
        <main
            className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white"
            style={dotTexture}
        >
            <div className="container mx-auto px-4 py-6 sm:py-8 lg:px-10">
                <HeroSlider slides={heroSlides} />

                <section className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-2xl font-black">Browse Gallery</h2>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {years.map((year) => (
                                    <Link
                                        key={year}
                                        href={`/festival/${year}`}
                                        className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-bold text-zinc-600 transition hover:border-orange-300 hover:text-orange-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                                    >
                                        {year}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {filters.map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    data-gallery-filter={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                                        activeFilter === filter
                                            ? "border-orange-600 bg-orange-600 text-white"
                                            : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300 hover:text-orange-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {visibleTextItems.length > 0 && (
                    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {visibleTextItems.map((item) => (
                            <TextMediaCard key={item.id} item={item} />
                        ))}
                    </section>
                )}

                {(activeFilter === "All" || activeFilter === "Photos") && (
                    <section className="mb-6">
                        <PhotoGalleryGrid items={visiblePhotos} />
                    </section>
                )}

                {activeFilter === "All" && visibleSupportItems.length > 0 && (
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {visibleSupportItems.map((item) => (
                            <TextMediaCard key={item.id} item={item} />
                        ))}
                    </section>
                )}

                <section className="mt-10 rounded-lg border border-orange-100 bg-orange-50 p-6 text-center dark:border-orange-900/50 dark:bg-orange-950/20 sm:p-7">
                    <h2 className="text-2xl font-black">Explore full editions</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-zinc-600 dark:text-zinc-300">
                        Each year page keeps the schedule, speakers, press coverage and
                        full festival context.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        {years.map((year) => (
                            <Button
                                key={`edition-${year}`}
                                asChild
                                variant="outline"
                                className="rounded-md border-zinc-300 bg-white hover:bg-zinc-950 hover:text-white dark:border-zinc-700 dark:bg-zinc-950"
                            >
                                <Link href={`/festival/${year}`}>
                                    {year} edition
                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
