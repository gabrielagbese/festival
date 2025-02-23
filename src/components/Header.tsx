"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const router = useRouter();

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleDropdownToggle = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const handleMouseEnter = (name: string) => {
        setOpenDropdown(name);
    };

    const handleMouseLeave = () => {
        setOpenDropdown(null);
    };

    const years = ["2024", "2023"];

    const navItems = [
        { name: "2025", href: "/2025" },
        {
            name: "Festival",
            href: "#",
            dropdown: true,
            subItems: years.map((year) => ({
                name: year,
                href: `/festival/${year}`,
            })),
        },
        {
            name: "Workshop",
            href: "#",
            dropdown: true,
            subItems: years.map((year) => ({
                name: year,
                href: `/workshop/${year}`,
            })),
        },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header className="bg-background/95 backdrop-blur-lg shadow-md supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
            <div className="container mx-auto px-4">
                <div className="flex h-20 items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 p-2"
                        >
                            <Image
                                src="/logo.png"
                                alt="CAVIC Festival Logo"
                                width={50}
                                height={50}
                            />
                            <span className="font-bold">
                                Cavic Festival <br /> of Creativity & Technology
                            </span>
                        </Link>
                    </div>
                    <nav className="hidden md:flex items-center justify-end flex-1">
                        {navItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative group px-3 h-20  flex items-center"
                                onMouseEnter={() =>
                                    item.dropdown && handleMouseEnter(item.name)
                                }
                                onMouseLeave={handleMouseLeave}
                            >
                                {item.dropdown ? (
                                    <button
                                        className={`text-md font-medium transition-colors hover:text-accent flex items-center ${
                                            pathname.startsWith(item.href)
                                                ? "text-accent"
                                                : "text-foreground/60"
                                        }`}
                                        onClick={() =>
                                            handleDropdownToggle(item.name)
                                        }
                                    >
                                        {item.name}
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`text-md font-medium transition-colors hover:text-accent flex items-center ${
                                            pathname.startsWith(item.href)
                                                ? "text-accent"
                                                : "text-foreground/60"
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                )}
                                {item.subItems && (
                                    <div
                                        className={`absolute top-[80px] left-0 w-48 rounded-md shadow-lg bg-background border border-border ${
                                            openDropdown === item.name
                                                ? "block"
                                                : "hidden"
                                        }`}
                                        style={{ marginTop: "-1px" }} // Remove gap between nav and dropdown
                                    >
                                        {item.subItems.map((subItem) => (
                                            <Link
                                                key={subItem.name}
                                                href={subItem.href}
                                                className="block px-4 py-2 text-md text-foreground/60 hover:bg-accent hover:text-accent-foreground"
                                                onClick={() =>
                                                    setOpenDropdown(null)
                                                }
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Open mobile menu"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <div key={item.name}>
                                <button
                                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                                        pathname.startsWith(item.href)
                                            ? "text-accent"
                                            : "text-foreground/60"
                                    }`}
                                    onClick={() => {
                                        if (item.dropdown) {
                                            handleDropdownToggle(item.name);
                                        } else {
                                            router.push(item.href);
                                            setMobileMenuOpen(false);
                                        }
                                    }}
                                >
                                    {item.name}
                                    {item.dropdown && (
                                        <ChevronDown className="ml-1 h-4 w-4 inline" />
                                    )}
                                </button>
                                {item.subItems &&
                                    openDropdown === item.name && (
                                        <div className="pl-4">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    href={subItem.href}
                                                    className="block px-3 py-2 rounded-md text-sm font-medium text-foreground/60 hover:text-accent"
                                                    onClick={() => {
                                                        setMobileMenuOpen(
                                                            false
                                                        );
                                                        setOpenDropdown(null);
                                                    }}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
