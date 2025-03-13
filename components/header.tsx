"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { usePathname } from "next/navigation"

export function Header() {
    const pathname = usePathname()
    const isEditor = pathname.includes("/editor")

    return (
        <header className="border-b bg-background">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-2xl font-bold">
                        BlogEditor
                    </Link>
                    {!isEditor && (
                        <nav className="hidden md:flex gap-6">
                            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                                Home
                            </Link>
                            <Link
                                href="/about"
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                About
                            </Link>
                        </nav>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {!isEditor && (
                        <Link href="/editor/new">
                            <Button>New Post</Button>
                        </Link>
                    )}
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}

