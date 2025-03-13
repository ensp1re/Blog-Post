export function Footer() {
    return (
        <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built with Next.js, Tailwind CSS, and shadcn/ui.
                </p>
                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                        Twitter
                    </a>
                </div>
            </div>
        </footer>
    )
}

