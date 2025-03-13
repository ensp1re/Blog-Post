export default function AboutPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-6">About BlogEditor</h1>
            <div className="prose max-w-none">
                <p>
                    BlogEditor is a powerful, feature-rich blog editing platform that allows you to create beautiful blog posts
                    with ease.
                </p>
                <h2>Features</h2>
                <ul>
                    <li>Rich text editing with formatting options</li>
                    <li>Image and video embedding</li>
                    <li>Flexible content layout</li>
                    <li>Real-time preview</li>
                    <li>Responsive design</li>
                    <li>Dark mode support</li>
                </ul>
                <h2>Technology</h2>
                <p>Built with modern web technologies including:</p>
                <ul>
                    <li>Next.js for the frontend framework</li>
                    <li>Slate.js for the rich text editor</li>
                    <li>Tailwind CSS for styling</li>
                    <li>shadcn/ui for UI components</li>
                    <li>MongoDB for data storage (optional)</li>
                </ul>
            </div>
        </div>
    )
}

