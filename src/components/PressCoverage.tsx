import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'
import { SlideIn } from './SlideIn'

interface PressArticle {
  title: string
  url: string
  source: string
  date: string
  excerpt: string
  logo: string
}

interface PressCoverageProps {
  articles: PressArticle[]
}

export function PressCoverage({ articles }: PressCoverageProps) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Press Coverage</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <SlideIn key={index} direction="up" delay={0.1 * index}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-x-4">
                <Image
                  src={article.logo || "/placeholder.svg"}
                  alt={article.source}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription>{article.source} • {article.date}</CardDescription>
                </div>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80">
                  <ExternalLink size={20} />
                </a>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{article.excerpt}</p>
              </CardContent>
            </Card>
          </SlideIn>
        ))}
      </div>
    </section>
  )
}

