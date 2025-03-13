/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BlogPreview } from "@/components/blog-preview"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { use } from "react"

export default function ViewPostPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const unwrappedParams = use(params)
    const [post, setPost] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Load post from localStorage
        const savedPosts = localStorage.getItem("blogPosts")
        if (savedPosts) {
            try {
                const posts = JSON.parse(savedPosts)
                const post = posts.find((p: any) => p.id === unwrappedParams.id)
                if (post) {
                    setPost(post)
                } else {
                    router.push("/")
                }
            } catch (error) {
                console.error("Error loading post:", error)
            }
        } else {
            router.push("/")
        }
        setLoading(false)
    }, [unwrappedParams.id, router])

    if (loading) {
        return (
            <div className="container mx-auto py-10 flex justify-center">
                <div className="animate-pulse">Loading post...</div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="container mx-auto py-10 text-center">
                <h1 className="text-2xl font-bold mb-4">Post not found</h1>
                <Link href="/">
                    <Button>Go to Home</Button>
                </Link>
            </div>
        )
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
                <div
                    className={`relative mb-8 rounded-lg overflow-hidden flex ${post.bannerAlign === "center"
                        ? "justify-center"
                        : post.bannerAlign === "right"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                >
                    <Image
                        width={1200}
                        height={400}
                        src={post.bannerUrl || "/placeholder.svg"}
                        alt={post.title}
                        className={`h-[300px] md:h-[400px] ${post.bannerAlign === "center" ? "object-contain" : "object-cover"}`}
                    />
                </div>
            )}

            <h1 className="text-4xl font-bold mb-4" style={{ textAlign: post.titleAlign || "left" }}>
                {post.title}
            </h1>
            <div className="flex items-center gap-2 mb-8 text-gray-500">
                <span>
                    {new Date(post.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </span>
            </div>

            <div className="prose max-w-none">
                <BlogPreview content={post.content} />
            </div>
        </div>
    )
}
