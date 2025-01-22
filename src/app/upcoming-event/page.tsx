import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const speakers = [
  { name: 'Eva Chen', bio: 'AI Ethics Researcher', image: '/placeholder.svg', socials: { twitter: '#', linkedin: '#' } },
  { name: 'Michael Lee', bio: 'Blockchain Innovator', image: '/placeholder.svg', socials: { twitter: '#', linkedin: '#' } },
  // Add more speakers...
]

export default function UpcomingEvent() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Countdown to upcoming event */}
      <section className="text-center py-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mb-12">
        <h1 className="text-4xl font-bold mb-4 text-white">Upcoming Tech Event 2025</h1>
        <div className="text-6xl font-bold mb-8 text-white">
          {/* Add countdown logic here */}
          00:00:00:00
        </div>
      </section>

      {/* Location, Theme, Brief */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Location:</strong> Tech City Innovation Hub</p>
            <p><strong>Theme:</strong> Sustainable Technology for a Better Future</p>
            <p><strong>Brief:</strong> Join us for an inspiring 3-day event focused on how technology can address global challenges and create a more sustainable future. Engage with thought leaders, participate in hands-on workshops, and explore cutting-edge innovations that are shaping our world.</p>
          </CardContent>
        </Card>
      </section>

      {/* Days (in tabs) */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Event Schedule</h2>
        <Tabs defaultValue="day1">
          <TabsList>
            <TabsTrigger value="day1">Day 1</TabsTrigger>
            <TabsTrigger value="day2">Day 2</TabsTrigger>
            <TabsTrigger value="day3">Day 3</TabsTrigger>
          </TabsList>
          <TabsContent value="day1">
            <Card>
              <CardHeader>
                <CardTitle>Day 1: Sustainable Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li>
                    <p><strong>9:00 AM - 10:30 AM</strong>: Keynote: "Technology for a Sustainable Future" by Eva Chen</p>
                    <p>Location: Main Auditorium</p>
                    <p>Eva Chen will discuss how emerging technologies can be leveraged to address global sustainability challenges.</p>
                  </li>
                  <li>
                    <p><strong>11:00 AM - 12:30 PM</strong>: Panel Discussion: "Green Tech Revolution"</p>
                    <p>Location: Panel Room A</p>
                    <p>Industry leaders discuss the latest trends and innovations in green technology.</p>
                  </li>
                  {/* Add more sessions for Day 1 */}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Add TabsContent for Day 2 and Day 3 */}
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
    </div>
  )
}

