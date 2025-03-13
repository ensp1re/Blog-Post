/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function PreviewPage() {
    const [post, setPost] = useState<any>(null)

    useEffect(() => {
        // Get the post data from localStorage if it exists
        const savedPost = localStorage.getItem("previewPost")
        if (savedPost) {
            try {
                setPost(JSON.parse(savedPost))
            } catch (error) {
                console.error("Error parsing preview post:", error)
            }
        }
    }, [])

    if (!post) {
        return (
            <div className="container mx-auto py-10 text-center">
                <h1 className="text-2xl font-bold mb-4">No preview available</h1>
                <p className="mb-6">Save a post first to preview it</p>
                <Link href="/">
                    <Button>Go to Home</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-6 flex justify-between">
                <Link href={post.id ? `/editor/${post.id}` : "/editor/new"}>
                    <Button variant="outline" size="sm">
                        ← Back to Editor
                    </Button>
                </Link>
                <div className="text-sm text-gray-500">Preview Mode</div>
            </div>

            {post.bannerUrl && (
                <div className="relative h-[300px] md:h-[400px] mb-8 rounded-lg overflow-hidden">
                    <Image
                        width={1200}
                        height={400}
                        src={post.bannerUrl || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
                </div>
            )}

            <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

            <div className="prose max-w-none">{renderContent(post.content)}</div>
        </div>
    )
}

function renderContent(content: any[]) {
    if (!content || !Array.isArray(content)) {
        return <p>No content available</p>
    }

    return content.map((node, i) => {
        switch (node.type) {
            case "paragraph":
                return (
                    <p key={i} style={{ textAlign: node.align || "left" }} className="mb-4">
                        {renderTextWithFormatting(node.children)}
                    </p>
                )
            case "heading-one":
                return (
                    <h1 key={i} style={{ textAlign: node.align || "left" }} className="text-3xl font-bold my-4">
                        {renderTextWithFormatting(node.children)}
                    </h1>
                )
            case "heading-two":
                return (
                    <h2 key={i} style={{ textAlign: node.align || "left" }} className="text-2xl font-bold my-3">
                        {renderTextWithFormatting(node.children)}
                    </h2>
                )
            case "image":
                return (
                    <div key={i} className="my-6">
                        <Image
                            width={800}
                            height={400}
                            src={node.url || "/placeholder.svg"}
                            alt={node.caption || "Blog image"}
                            className="max-w-full rounded-lg"
                        />
                        {node.caption && <p className="text-sm text-center text-gray-500 mt-1">{node.caption}</p>}
                    </div>
                )
            case "video":
                return (
                    <div key={i} className="my-6">
                        <iframe
                            src={node.url}
                            className="w-full aspect-video rounded-lg"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        {node.caption && <p className="text-sm text-center text-gray-500 mt-1">{node.caption}</p>}
                    </div>
                )
            default:
                return null
        }
    })
}

function renderTextWithFormatting(textNodes: any[]) {
    if (!textNodes || !Array.isArray(textNodes)) {
        return null
    }

    return textNodes.map((node, i) => {
        let text = node.text

        if (node.bold) {
            text = <strong key={i}>{text}</strong>
        }
        if (node.italic) {
            text = <em key={i}>{text}</em>
        }
        if (node.code) {
            text = (
                <code key={i} className="bg-gray-100 px-1 py-0.5 rounded">
                    {text}
                </code>
            )
        }
        if (node.strikethrough) {
            text = <del key={i}>{text}</del>
        }

        return text
    })
}

