import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/40">
      <div className="container py-8 px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm text-muted-foreground">Tech Festival is an annual celebration of innovation and technology, bringing together industry leaders, innovators, and enthusiasts.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-accent">Home</Link></li>
              <li><Link href="/festival/2025" className="text-sm text-muted-foreground hover:text-accent">Festival 2025</Link></li>
              <li><Link href="/workshop/2025" className="text-sm text-muted-foreground hover:text-accent">Workshop 2025</Link></li>
              <li><Link href="/sponsors" className="text-sm text-muted-foreground hover:text-accent">Sponsors</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm text-muted-foreground">Email: info@techfestival.com</p>
            <p className="text-sm text-muted-foreground">Phone: +1 (123) 456-7890</p>
            <p className="text-sm text-muted-foreground">Address: 123 Tech Street, Innovation City, TC 12345</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-accent"><Facebook size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-accent"><Twitter size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-accent"><Instagram size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-accent"><Linkedin size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-accent"><Youtube size={20} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center">
          <p className="text-sm text-muted-foreground">&copy; 2025 Tech Festival. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

