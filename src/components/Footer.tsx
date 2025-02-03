import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-background border-t border-border/40">
            <div className="container py-8 px-4 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* <div>
                        <h3 className="text-lg font-semibold mb-4">About Us</h3>
                        <p className="text-sm text-muted-foreground">
                            A vibrant gathering of creatives and tech
                            enthusiasts, the festival celebrates collaboration
                            and innovation under the theme Interactive Futures:
                            Bridging Realities. Experience a dynamic blend of
                            art and technology through immersive exhibitions,
                            interactive workshops, thought-provoking
                            discussions, and live performances. It’s a space
                            where ideas merge, connections thrive, and the
                            future of creativity is reimagined.
                        </p>
                    </div> */}

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <p className="text-sm text-muted-foreground">
                            Email: submissions@cavicfestival.africa
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Phone: +2349028346940
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Address: No. 30, Agadez Cres., Wuse ll, Abuja,
                            Nigeria.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Follow Us
                        </h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://www.facebook.com/CAVICNIGERIA"
                                className="text-muted-foreground hover:text-accent"
                            >
                                <Facebook size={20} />
                            </a>

                            <a
                                href="https://www.instagram.com/cavicnigeria/"
                                className="text-muted-foreground hover:text-accent"
                            >
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-border/40 text-center">
                    <p className="text-sm text-muted-foreground">
                        &copy; 2025 CAVIC Nigeria. All rights reserved.
                    </p>
                    <div>
                        <p className="text-gray-500 font-chakra-petch">
                            Developed by{" "}
                            <a href="https://gabes.site" className="underline">
                                Gabriel Agbese
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
