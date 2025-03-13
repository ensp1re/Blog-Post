/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Image from "next/image"
import { useMemo } from "react"

export function BlogContent({ content }: { content: any[] }) {
    const renderedContent = useMemo(() => {
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
                case "link":
                    return (
                        <a key={i} href={node.url} className="text-blue-500 underline">
                            {renderTextWithFormatting(node.children)}
                        </a>
                    )
                default:
                    return null
            }
        })
    }, [content])

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

    return <div>{renderedContent}</div>
}

