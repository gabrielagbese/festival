"use client";
import Image from "next/image";
import {
	Globe,
	BookOpen,
	Link,
	Play,
	Maximize,
	Volume2,
	VolumeX,
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
import { useState, useRef, useEffect } from "react";
import festivalData from "../data/2025.json";

export default function CavicFestival2025() {
	const [isMuted, setIsMuted] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
	const videoRef = useRef(null);
	const videoContainerRef = useRef(null);

	// Scroll-triggered play functionality
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (
						entry.isIntersecting &&
						!hasPlayedOnce &&
						videoRef.current
					) {
						videoRef.current
							.play()
							.then(() => {
								setIsPlaying(true);
								setHasPlayedOnce(true);
							})
							.catch(console.error);
					}
				});
			},
			{ threshold: 0.5 }
		);

		if (videoContainerRef.current) {
			observer.observe(videoContainerRef.current);
		}

		return () => observer.disconnect();
	}, [hasPlayedOnce]);

	const togglePlay = () => {
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.pause();
				setIsPlaying(false);
			} else {
				videoRef.current
					.play()
					.then(() => {
						setIsPlaying(true);
						setHasPlayedOnce(true);
					})
					.catch(console.error);
			}
		}
	};

	const toggleMute = () => {
		if (videoRef.current) {
			videoRef.current.muted = !isMuted;
			setIsMuted(!isMuted);
		}
	};

	const toggleFullscreen = () => {
		if (videoRef.current) {
			if (videoRef.current.requestFullscreen) {
				videoRef.current.requestFullscreen();
			} else if (videoRef.current.webkitRequestFullscreen) {
				videoRef.current.webkitRequestFullscreen();
			} else if (videoRef.current.msRequestFullscreen) {
				videoRef.current.msRequestFullscreen();
			}
		}
	};

	if (!festivalData) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8 space-y-12">
			<Card
				className="bg-gradient-to-r from-orange-600 to-orange-400 overflow-hidden text-white 
      flex flex-col lg:flex-row items-center "
			>
				<div
					ref={videoContainerRef}
					className="relative w-full max-w-sm mx-auto aspect-square p-2 flex justify-center items-center rounded-lg overflow-clip"
				>
					<video
						ref={videoRef}
						src="/video.mp4"
						muted={isMuted}
						playsInline
						className="p-4 object-cover rounded-lg w-full h-full"
						onPlay={() => setIsPlaying(true)}
						onPause={() => setIsPlaying(false)}
					/>

					{/* Video Controls */}
					<div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
						<button
							onClick={togglePlay}
							className="bg-black bg-opacity-70 text-white p-4 rounded-full hover:bg-opacity-90 transition-all transform hover:scale-110"
							aria-label={
								isPlaying ? "Pause video" : "Play video"
							}
						>
							{isPlaying ? (
								<svg
									className="w-8 h-8"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
								</svg>
							) : (
								<Play className="w-8 h-8" />
							)}
						</button>
					</div>

					{/* Control Buttons */}
					<div className="absolute top-4 right-4 flex gap-2">
						<button
							onClick={toggleMute}
							className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
							aria-label={isMuted ? "Unmute video" : "Mute video"}
						>
							{isMuted ? (
								<VolumeX className="w-4 h-4" />
							) : (
								<Volume2 className="w-4 h-4" />
							)}
						</button>

						<button
							onClick={toggleFullscreen}
							className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
							aria-label="Enter fullscreen"
						>
							<Maximize className="w-4 h-4" />
						</button>
					</div>
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
			<RegistrationSection />
			<Separator className="my-12" />
			<SpeakersSection data={festivalData.speakers} />
			<Separator className="my-12" />
			<FestivalSpeakersSection />
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

function FestivalSpeakersSection() {
	const [selectedSpeaker, setSelectedSpeaker] = useState(null);

	const festivalSpeakers = [
		{
			name: "Yene",
			role: "Vocalist & Guitarist",
			image: "/fest-speaker/yene.png",
			bio: 'Yene is a vocalist and guitarist based in Abuja, exploring the blend of her voice and instrument. Inspired by soul, jazz, RnB, afro, and gospel, she thrives on live performances that deepen her connection with audiences. Known for her "big voice" and "powerful vocals".',
		},
		{
			name: "Oluwadayo",
			role: "Singer, Songwriter & Stage Performer",
			image: "/fest-speaker/oluwadayo.png",
			bio: "Oluwadayo is a multifaceted artist - a professional singer, songwriter, and stage performer dedicated to spreading positivity, hope, and faith through her craft. With experience performing for diverse audiences on various stages, she skillfully connects with her fans through heartfelt artistry.",
		},
		{
			name: "Friday Ramses Onoja, SAN",
			role: "Litigation Attorney & Art Enthusiast",
			image: "/fest-speaker/onoja.jpg",
			bio: 'Friday Ramses Onoja, SAN, distinguished litigation attorney and art enthusiast, brings decades of legal expertise and a deep passion for photography to the CAVIC Festival 2025 panel on "AI and the Arts – Possibilities, Ethics, and Future Pathways." His unique legal-artistic perspective bridges creativity, technology, and ethical discourse.',
		},
		{
			name: "Nana Sule",
			role: "Writer, Editor & Communications Strategist",
			image: "/fest-speaker/sule.jpg",
			bio: "Nana Sule is a Writer, Editor, and Communications Strategist working at the intersections of art, literature, feminism, environmental advocacy, and decolonial knowledge. With experience in brand messaging, digital content, and community engagement, she is also skilled in design, newsletter curation, podcasting, public speaking, and team management.",
		},
		{
			name: "Marina El Chalouhi",
			role: "Account Director & Producer",
			image: "/fest-speaker/marina.png",
			bio: "Marina El Chalouhi is a Belgian account director and producer with Lebanese and Armenian roots. At Gang Group, she drives strategic content for global brands, while as co-founder of Maison Kimia, she amplifies diasporic and Afro-descendant narratives through arts and culture.",
		},
		{
			name: "Habiba Nur Alkali",
			role: "Author",
			image: "/fest-speaker/alkali.jpg",
			bio: "Habiba Nur Alkali is a Nigerian author and seasoned civil servant with 18 years in public service. Her debut novel, The Phantom Army, based on the Northeast insurgency, is taught in tertiary institutions. Her second book, Forty Winks, a poetry collection, was released in June 2025.",
		},
		{
			name: "Busola Perez-Folayan",
			role: "Head of NASENI Innovation Hub",
			image: "/fest-speaker/busola.jpg",
			bio: "Busola Perez-Folayan, Head of NASENI Innovation Hub and a powerhouse in Africa's innovation ecosystem! A strategic management expert and startup mentor, she has empowered over 5,000 entrepreneurs across sectors. At CAVIC Festival 2025, she joins our panel to explore how innovation and technology can transform Africa's creative future.",
		},
		{
			name: "Attah Samson Igoche",
			role: "Founder, CEO of Aiivon Innovation Hub",
			image: "/fest-speaker/samson.png",
			bio: "Sam brings over 15 years of expertise in the creative-tech ecosystem, enterprise development, and capacity building to the Cavic Festival 2025. As the visionary behind Aiivon Innovation Hub, He executes impactful entrepreneurship programs nationwide, through strategic collaborations with organizations such as JICA, GAIN, AFDB, AFD, CBN, NIRSAL, USAID, Ford Foundation, and the British Council. He has developed and delivered incubation frameworks that have empowered hundreds of businesses across Nigeria.",
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-4xl font-bold text-orange-900">
					Festival Speakers
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{festivalSpeakers.map((speaker, index) => (
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
							</div>
							<div className="md:w-2/3">
								<div className="prose prose-orange max-w-none">
									<p className="whitespace-pre-line text-gray-700">
										{selectedSpeaker.bio}
									</p>
								</div>
							</div>
						</div>
					</DialogContent>
				)}
			</Dialog>
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

	if (!data) {
		return null;
	}

	if (!Array.isArray(data)) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-4xl font-bold text-orange-900">
					Workshop Speakers
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

function RegistrationSection() {
	const handleRegistrationClick = () => {
		window.open('https://docs.google.com/forms/d/e/1FAIpQLSfKJlvZmDwSeRv3dCuM6gCLp9mk8v_ez0jbGO13WDV6QOuZkg/viewform?usp=dialog', '_blank');
	};

	return (
		<Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
			<CardHeader className="text-center">
				<CardTitle className="text-4xl font-bold text-orange-900 mb-4">
					Register for CAVIC Festival 2025
				</CardTitle>
				<p className="text-lg text-orange-800 max-w-2xl mx-auto">
					Don't miss out on this incredible celebration of creativity, arts, and innovation. 
					Secure your spot at the most anticipated cultural event of the year!
				</p>
			</CardHeader>
			<CardContent className="text-center pb-8">
				<div className="space-y-6">
					<div className="flex flex-col md:flex-row justify-center items-center gap-4 text-orange-700">
						<div className="flex items-center gap-2">
							<Globe className="w-5 h-5" />
							<span>Interactive Workshops</span>
						</div>
						<div className="flex items-center gap-2">
							<BookOpen className="w-5 h-5" />
							<span>Expert Speakers</span>
						</div>
						<div className="flex items-center gap-2">
							<Link className="w-5 h-5" />
							<span>Networking Opportunities</span>
						</div>
					</div>
					
					<button
						onClick={handleRegistrationClick}
						className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
					>
						Register Now - It's Free!
					</button>
					
					<p className="text-sm text-orange-600 mt-4">
						Registration is completely free. Limited spots available.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
