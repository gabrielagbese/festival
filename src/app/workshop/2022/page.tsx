import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const speakers = [
  { name: 'John Doe', bio: 'AI Researcher', image: '/placeholder.svg', socials: { twitter: '#', linkedin: '#' } },
  { name: 'Jane Smith', bio: 'Blockchain Expert', image: '/placeholder.svg', socials: { twitter: '#', linkedin: '#' } },
  // Add more speakers...
]

const highlights = [
  { title: 'Keynote Speech', description: 'An inspiring talk on the future of AI', images: ['/placeholder.svg'], video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  { title: 'VR Demo', description: 'Hands-on experience with cutting-edge VR technology', images: ['/placeholder.svg'], video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  // Add more highlights...
]

export default function Workshop2022() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Countdown to upcoming workshop */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mb-12">
        <h1 className="text-4xl font-bold mb-4 text-white">Tech Workshop 2022</h1>
        <div className="text-6xl font-bold mb-8 text-white">
          {/* Add countdown logic here */}
          00:00:00:00
        </div>
      </section>

      {/* Location, Theme, Brief */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Workshop Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Location:</strong> Tech City Convention Center</p>
            <p><strong>Theme:</strong> AI and the Future of Work</p>
            <p><strong>Brief:</strong> Join us for an intensive 4-day workshop exploring the impact of AI on various industries and the future of work. Engage in hands-on sessions, listen to expert talks, and network with industry leaders to gain insights into how AI is reshaping our professional landscape.</p>
          </CardContent>
        </Card>
      </section>

      {/* Days (in tabs) */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Workshop Schedule</h2>
        <Tabs defaultValue="day1">
          <TabsList>
            <TabsTrigger value="day1">Day 1</TabsTrigger>
            <TabsTrigger value="day2">Day 2</TabsTrigger>
            <TabsTrigger value="day3">Day 3</TabsTrigger>
            <TabsTrigger value="day4">Day 4</TabsTrigger>
          </TabsList>
          <TabsContent value="day1">
            <Card>
              <CardHeader>
                <CardTitle>Day 1: Introduction to AI and Machine Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li>
                    <p><strong>9:00 AM - 10:30 AM</strong>: Keynote: "The State of AI" by Dr. Jane Smith</p>
                    <p>Location: Main Auditorium</p>
                    <p>Dr. Smith will provide an overview of current AI trends and their potential impact on various industries.</p>
                  </li>
                  <li>
                    <p><strong>11:00 AM - 12:30 PM</strong>: Workshop: "Hands-on Machine Learning" by John Doe</p>
                    <p>Location: Lab A</p>
                    <p>An interactive session where participants will get hands-on experience with basic machine learning algorithms.</p>
                  </li>
                  {/* Add more sessions for Day 1 */}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Add TabsContent for Day 2, Day 3, and Day 4 */}
        </Tabs>
      </section>

      {/* Speakers section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Featured Speakers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {speakers.map((speaker, index) => (
            <Card key={index}>
              <CardHeader>
                <Image src={speaker.image || "/placeholder.svg"} alt={speaker.name} width={100} height={100} className="rounded-full" />
                <CardTitle>{speaker.name}</CardTitle>
                <CardDescription>{speaker.bio}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <a href={speaker.socials.twitter} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">Twitter</Button>
                  </a>
                  <a href={speaker.socials.linkedin} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">LinkedIn</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Event specific highlights */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Event Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {highlights.map((highlight, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{highlight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{highlight.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {highlight.images.map((image, imgIndex) => (
                    <Image key={imgIndex} src={image || "/placeholder.svg"} alt={`Highlight ${index + 1}`} width={200} height={150} className="rounded-lg" />
                  ))}
                </div>
                <div className="mt-4">
                  <iframe width="100%" height="315" src={highlight.video} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* General gallery */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </section>

      {/* Mentions in press */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Press Coverage</h2>
        <ul className="space-y-4">
          <li>
            <a href="#" className="text-blue-500 hover:underline">TechCrunch: "Tech Workshop 2022 Showcases Cutting-Edge AI Applications"</a>
          </li>
          <li>
            <a href="#" className="text-blue-500 hover:underline">Forbes: "How Tech Workshop 2022 is Shaping the Future of Work"</a>
          </li>
          <li>
            <a href="#" className="text-blue-500 hover:underline">Wired: "Innovations Unveiled at Tech Workshop 2022"</a>
          </li>
        </ul>
      </section>
    </div>
  )
}

