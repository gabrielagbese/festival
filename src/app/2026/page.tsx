import Image from "next/image";

export default function Festival2026() {
    return (
        <div className="container mx-auto px-4 py-12 lg:py-20">
            {/* Hero Section with Flyer */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                    {/* Flyer Image */}
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
                        <Image
                            src="/2026-festival-flyer.png"
                            alt="CAVIC Festival 2026"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-col justify-center">
                        <div className="inline-block px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-semibold rounded-full mb-6 w-fit">
                            Coming 2026
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight">
                            CAVIC Festival of Creativity & Technology
                        </h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                            Join us for the next edition of the CAVIC Festival – where creativity meets technology. 
                            Experience inspiring talks, hands-on workshops, and connect with a vibrant community of innovators.
                        </p>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                            Whether you're an artist, developer, designer, or simply curious about the intersection 
                            of art and technology, there's a place for you at CAVIC 2026.
                        </p>

                        {/* Quick Info */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Location</div>
                                <div className="font-semibold text-zinc-900 dark:text-white">Abuja, Nigeria</div>
                            </div>
                            <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Status</div>
                                <div className="font-semibold text-orange-600 dark:text-orange-500">Registration Open</div>
                            </div>
                        </div>

                        {/* View Past Editions */}
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="/festival/2025"
                                className="text-sm text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-500 transition-colors"
                            >
                                View 2025 Festival →
                            </a>
                            <a
                                href="/workshop/2025"
                                className="text-sm text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-500 transition-colors"
                            >
                                View 2025 Workshops →
                            </a>
                        </div>
                    </div>
                </div>

                {/* Registration CTA Section */}
                <section className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 lg:p-12 text-center text-white shadow-xl">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                        Be Part of CAVIC 2026
                    </h2>
                    <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
                        We're looking for speakers, workshop facilitators, artists, and collaborators 
                        to make this edition unforgettable. Register your interest today!
                    </p>
                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSeGNm3ieIXXvjhgQrsDhIc9K6lJQ4M1VGHEMNsc5O1pzZ6FXw/viewform?usp=header"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                    >
                        Register to Participate
                    </a>
                    <p className="text-sm text-orange-200 mt-6">
                        Open to speakers, artists, workshop facilitators, volunteers, and sponsors
                    </p>
                </section>
            </div>
        </div>
    );
}
