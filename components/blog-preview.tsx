import Image from "next/image"

/* eslint-disable @typescript-eslint/no-explicit-any */
export function BlogPreview({ content }: { content: any[] }) {
    if (!content || !Array.isArray(content)) {
        return <p>No content available</p>
    }

    return (
        <div>
            {content.map((node, i) => {
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
                                <div
                                    className={`flex ${node.align === "center"
                                        ? "justify-center"
                                        : node.align === "right"
                                            ? "justify-end"
                                            : "justify-start"
                                        }`}
                                >
                                    <Image
                                        width={600}
                                        height={400}
                                        src={node.url || "/placeholder.svg?height=200&width=400"}
                                        alt={node.caption || "Blog image"}
                                        className="max-w-full rounded-lg"
                                    />
                                </div>
                                {node.caption && <p className="text-sm text-center text-gray-500 mt-1">{node.caption}</p>}
                            </div>
                        )
                    case "video":
                        return (
                            <div key={i} className="my-6">
                                <div
                                    className={`flex ${node.align === "center"
                                        ? "justify-center"
                                        : node.align === "right"
                                            ? "justify-end"
                                            : "justify-start"
                                        }`}
                                >
                                    <iframe
                                        src={node.url}
                                        className="w-full max-w-2xl aspect-video rounded-lg"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                {node.caption && <p className="text-sm text-center text-gray-500 mt-1">{node.caption}</p>}
                            </div>
                        )
                    default:
                        return null
                }
            })}
        </div>
    )
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

