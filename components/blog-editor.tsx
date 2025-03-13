/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { ChangeEvent } from "react"

import { useCallback, useEffect, useState, useRef } from "react"
import { createEditor, Transforms, Path, BaseEditor } from "slate"
import { Slate, Editable, withReact, ReactEditor, useSlate, ReactEditor as ReactEditorType } from "slate-react"
import { withHistory } from "slate-history"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Bold,
    Italic,
    Code,
    Strikethrough,
    ImageIcon,
    Video,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Trash2,
} from "lucide-react"
import Image from "next/image"

type CustomElement = {
    type: "paragraph" | "heading-one" | "heading-two" | "image" | "video" | "link"
    align?: "left" | "center" | "right"
    url?: string
    caption?: string
    children: CustomText[]
} & { align?: "left" | "center" | "right" }

type CustomText = {
    text: string
    bold?: boolean
    italic?: boolean
    code?: boolean
    strikethrough?: boolean
}

type CustomEditor = BaseEditor & ReactEditorType

const initialValue: CustomElement[] = [
    {
        type: "paragraph",
        children: [{ text: "Start writing your blog post here..." }],
    },
]

const ImageToolbar = ({ element, path }: { element: any; path: Path }) => {
    const editor = useSlate()
    const ref = useRef<HTMLDivElement>(null)

    const updateAlignment = (align: "left" | "center" | "right") => {
        Transforms.setNodes(editor, { align } as Partial<CustomElement>, { at: path })
    }

    const deleteImage = () => {
        Transforms.removeNodes(editor, { at: path })
    }

    return (
        <div
            ref={ref}
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 shadow-md rounded-md flex items-center p-1 z-10 border"
        >
            <Button
                variant="ghost"
                size="sm"
                onClick={() => updateAlignment("left")}
                className={element.align === "left" ? "bg-gray-200 dark:bg-gray-700" : ""}
            >
                <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => updateAlignment("center")}
                className={element.align === "center" ? "bg-gray-200 dark:bg-gray-700" : ""}
            >
                <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => updateAlignment("right")}
                className={element.align === "right" ? "bg-gray-200 dark:bg-gray-700" : ""}
            >
                <AlignRight className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
            <Button
                variant="ghost"
                size="sm"
                onClick={deleteImage}
                className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    )
}

const Element = ({ attributes, children, element }: any) => {
    const [selected, setSelected] = useState(false)
    const [path, setPath] = useState<Path | null>(null)
    const editor = useSlate()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        try {
            const nodePath = ReactEditor.findPath(editor as ReactEditor, element)
            setPath(nodePath)
        } catch (error) {
            console.log(error)
        }

    }, [editor, element])

    const handleClick = (e: React.MouseEvent) => {
        if (element.type === "image" || element.type === "video") {
            e.stopPropagation()
            setSelected(!selected)
        }
    }

    // Hide toolbar when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setSelected(false)
            }
        }

        if (selected) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [selected])

    switch (element.type) {
        case "heading-one":
            return (
                <h1 {...attributes} className="text-3xl font-bold my-4" style={{ textAlign: element.align }}>
                    {children}
                </h1>
            )
        case "heading-two":
            return (
                <h2 {...attributes} className="text-2xl font-bold my-3" style={{ textAlign: element.align }}>
                    {children}
                </h2>
            )
        case "image":
            return (
                <div {...attributes} ref={ref} contentEditable={false} className="my-4 relative" onClick={handleClick}>
                    {selected && path && <ImageToolbar element={element} path={path} />}
                    <div
                        className={`not-prose flex ${element.align === "center"
                            ? "justify-center"
                            : element.align === "right"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                    >
                        <Image
                            height={600}
                            width={400}
                            src={element.url || "/placeholder.svg?height=200&width=400"}
                            alt={element.caption || "Blog image"}
                            className="max-w-full rounded-lg cursor-pointer"
                        />
                    </div>
                    {element.caption && <p className="text-sm text-center text-gray-500 mt-1">{element.caption}</p>}
                    {children}
                </div>
            )
        case "video":
            return (
                <div {...attributes} contentEditable={false} className="my-4 relative" ref={ref} onClick={handleClick}>
                    {selected && path && <ImageToolbar element={element} path={path} />}
                    <div
                        className={`not-prose flex ${element.align === "center"
                            ? "justify-center"
                            : element.align === "right"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                    >
                        <iframe
                            src={element.url}
                            className="w-full max-w-2xl aspect-video rounded-lg cursor-pointer"
                            style={{ border: "0" }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    {element.caption && <p className="text-sm text-center text-gray-500 mt-1">{element.caption}</p>}
                    {children}
                </div>
            )
        case "link":
            return (
                <a {...attributes} href={element.url} className="text-blue-500 underline">
                    {children}
                </a>
            )
        default:
            return (
                <p {...attributes} style={{ textAlign: element.align }}>
                    {children}
                </p>
            )
    }
}

const Leaf = ({ attributes, children, leaf }: any) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }

    if (leaf.italic) {
        children = <em>{children}</em>
    }

    if (leaf.code) {
        children = <code className="bg-gray-100 px-1 py-0.5 rounded">{children}</code>
    }

    if (leaf.strikethrough) {
        children = <del>{children}</del>
    }

    return <span {...attributes}>{children}</span>
}

export function BlogEditor({ initialContent, onChange }: { initialContent: any; onChange: (value: any) => void }) {
    const [editor] = useState(() => withHistory(withReact(createEditor())))
    const [showMediaDialog, setShowMediaDialog] = useState(false)
    const [mediaType, setMediaType] = useState<"image" | "video">("image")
    const [mediaUrl, setMediaUrl] = useState("")
    const [mediaCaption, setMediaCaption] = useState("")
    const [selection, setSelection] = useState<any>(null)

    const storeSelection = useCallback(() => {
        setSelection(editor.selection)
    }, [editor])

    const insertMedia = useCallback(() => {
        if (!mediaUrl) return

        const media = {
            type: mediaType,
            url: mediaUrl,
            caption: mediaCaption,
            align: "center", // Default alignment
            children: [{ text: "" }],
        }

        // Restore selection and insert media
        if (selection) {
            editor.selection = selection
        }

        editor.insertNode(media)
        setMediaUrl("")
        setMediaCaption("")
        setShowMediaDialog(false)
    }, [editor, mediaType, mediaUrl, mediaCaption, selection])

    // Format text with the given format
    const toggleFormat = useCallback(
        (format: string) => {
            const isActive = isFormatActive(editor, format)

            if (isActive) {
                editor.removeMark(format)
            } else {
                editor.addMark(format, true)
            }
        },
        [editor],
    )

    // Check if the given format is active
    const isFormatActive = (editor: CustomEditor, format: string) => {
        const marks = editor.getMarks()
        return marks ? marks[format as keyof typeof marks] === true : false
    }

    // Set alignment for the current block
    const setAlignment = useCallback(
        (align: "left" | "center" | "right") => {
            const [match] = editor.nodes({
                match: (n) => "type" in n && (n.type === "paragraph" || n.type === "heading-one" || n.type === "heading-two"),
            })

            if (match) {
                const [, path] = match
                editor.setNodes({ align } as Partial<CustomElement>, { at: path })
            }
        },
        [editor],
    )

    // Initialize with content if provided
    useEffect(() => {
        if (initialContent && Array.isArray(initialContent) && initialContent.length > 0) {
            editor.children = initialContent
            editor.onChange()
        }
    }, [editor, initialContent])

    return (
        <div className="blog-editor">
            <div className="border-b p-2 flex flex-wrap gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFormat("bold")}
                    className={isFormatActive(editor, "bold") ? "bg-gray-200" : ""}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFormat("italic")}
                    className={isFormatActive(editor, "italic") ? "bg-gray-200" : ""}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFormat("strikethrough")}
                    className={isFormatActive(editor, "strikethrough") ? "bg-gray-200" : ""}
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFormat("code")}
                    className={isFormatActive(editor, "code") ? "bg-gray-200" : ""}
                >
                    <Code className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                <Button variant="ghost" size="sm" onClick={() => setAlignment("left")}>
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setAlignment("center")}>
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setAlignment("right")}>
                    <AlignRight className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                <Dialog open={showMediaDialog} onOpenChange={setShowMediaDialog}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setMediaType("image")
                                storeSelection()
                            }}
                        >
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Insert {mediaType}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">URL</label>
                                <Input
                                    placeholder={`Enter ${mediaType} URL`}
                                    value={mediaUrl}
                                    onChange={(e: ChangeEvent) => setMediaUrl((e.target as HTMLInputElement).value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Caption (optional)</label>
                                <Textarea
                                    placeholder="Enter caption"
                                    value={mediaCaption}
                                    onChange={(e: ChangeEvent) => setMediaCaption((e.target as HTMLInputElement).value)}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowMediaDialog(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={insertMedia}>Insert</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={showMediaDialog} onOpenChange={setShowMediaDialog}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setMediaType("video")
                                storeSelection()
                            }}
                        >
                            <Video className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                </Dialog>
            </div>

            <Slate
                editor={editor}
                initialValue={initialValue}
                onChange={(value) => {
                    const isAstChange = editor.operations.some((op) => "set_selection" !== op.type)
                    if (isAstChange) {
                        onChange(value)
                    }
                }}
            >
                <Editable
                    className="p-4 min-h-[400px] prose max-w-none"
                    renderElement={(props) => <Element {...props} />}
                    renderLeaf={(props) => <Leaf {...props} />}
                    placeholder="Start writing your blog post here..."
                    spellCheck
                    autoFocus
                />
            </Slate>
        </div>
    )
}

