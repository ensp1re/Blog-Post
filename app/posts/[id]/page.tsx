import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BlogContent } from "@/components/blog-content"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import Image from "next/image"

export default async function BlogPostPage({ params }: { params: { id: string } }) {
    let post

    try {
        const { db } = await connectToDatabase()
        post = await db.collection("posts").findOne({ _id: new ObjectId(params.id) })
    } catch (error) {
        console.error("Error fetching post:", error)
    }

    if (!post) {
        return notFound()
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-6">
                <Link href="/">
                    <Button variant="outline" size="sm">
                        ← Back to all posts
                    </Button>
                </Link>
            </div>

            {post.bannerUrl && (
                <div className="relative h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
                    <Image
                        width={1200}
                        height={400}
                        src={post.bannerUrl || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
                </div>
            )}

            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-2 mb-8 text-gray-500">
                <span>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </span>
            </div>

            <div className="prose max-w-none">
                <BlogContent content={post.content} />
            </div>
        </div>
    )
}

