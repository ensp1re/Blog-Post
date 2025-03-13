/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BlogEditor } from "@/components/blog-editor"
import { v4 as uuidv4 } from "uuid"
import { BlogPreview } from "@/components/blog-preview"
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import Image from "next/image"
import { use } from "react"

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const unwrappedParams = use(params)
    const isNew = unwrappedParams.id === "new"
    const [title, setTitle] = useState("")
    const [titleAlign, setTitleAlign] = useState<"left" | "center" | "right">("left")
    const [bannerUrl, setBannerUrl] = useState("")
    const [bannerAlign, setBannerAlign] = useState<"left" | "center" | "right">("center")
    const [content, setContent] = useState<any>([
        {
            type: "paragraph",
            children: [{ text: "Start writing your blog post here..." }],
        },
    ])
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(!isNew)
    const [previewMode, setPreviewMode] = useState(false)

    useEffect(() => {
        if (!isNew) {
            // Load post from localStorage
            const savedPosts = localStorage.getItem("blogPosts")
            if (savedPosts) {
                try {
                    const posts = JSON.parse(savedPosts)
                    const post = posts.find((p: any) => p.id === unwrappedParams.id)
                    if (post) {
                        setTitle(post.title)
                        setTitleAlign(post.titleAlign || "left")
                        setBannerUrl(post.bannerUrl || "")
                        setBannerAlign(post.bannerAlign || "center")
                        setContent(post.content)
                    }
                } catch (error) {
                    console.error("Error loading post:", error)
                }
            }
            setLoading(false)
        } else {
            setLoading(false)
        }
    }, [unwrappedParams.id, isNew])

    const handleSave = () => {
        if (!title) return

        setSaving(true)
        try {
            // Get existing posts
            const savedPosts = localStorage.getItem("blogPosts")
            const posts = savedPosts ? JSON.parse(savedPosts) : []

            const now = new Date().toISOString()

            if (isNew) {
                // Create new post
                const newPost = {
                    id: uuidv4(),
                    title,
                    titleAlign,
                    bannerUrl,
                    bannerAlign,
                    content,
                    createdAt: now,
                    updatedAt: now,
                }
                posts.unshift(newPost)
                localStorage.setItem("blogPosts", JSON.stringify(posts))
                router.push(`/editor/${newPost.id}`)
            } else {
                // Update existing post
                const updatedPosts = posts.map((post: any) => {
                    if (post.id === unwrappedParams.id) {
                        return {
                            ...post,
                            title,
                            titleAlign,
                            bannerUrl,
                            bannerAlign,
                            content,
                            updatedAt: now,
                        }
                    }
                    return post
                })
                localStorage.setItem("blogPosts", JSON.stringify(updatedPosts))
            }
        } catch (error) {
            console.error("Error saving post:", error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-10 flex justify-center">
                <div className="animate-pulse">Loading editor...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{isNew ? "Create New Post" : "Edit Post"}</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push("/")}>
                        Cancel
                    </Button>
                    <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                        {previewMode ? "Edit" : "Preview"}
                    </Button>
                    <Button onClick={handleSave} disabled={saving || !title}>
                        {saving ? "Saving..." : "Save Post"}
                    </Button>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium">Title</label>
                        <div className="flex border rounded-md overflow-hidden">
                            <Button
                                type="button"
                                variant={titleAlign === "left" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setTitleAlign("left")}
                                className="rounded-none"
                            >
                                <AlignLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant={titleAlign === "center" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setTitleAlign("center")}
                                className="rounded-none"
                            >
                                <AlignCenter className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant={titleAlign === "right" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setTitleAlign("right")}
                                className="rounded-none"
                            >
                                <AlignRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter post title"
                        className="text-xl"
                        style={{ textAlign: titleAlign }}
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium">Banner Image URL</label>
                        <div className="flex border rounded-md overflow-hidden">
                            <Button
                                type="button"
                                variant={bannerAlign === "left" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setBannerAlign("left")}
                                className="rounded-none"
                            >
                                <AlignLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant={bannerAlign === "center" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setBannerAlign("center")}
                                className="rounded-none"
                            >
                                <AlignCenter className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant={bannerAlign === "right" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setBannerAlign("right")}
                                className="rounded-none"
                            >
                                <AlignRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            value={bannerUrl}
                            onChange={(e) => setBannerUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                        />
                        <Button variant="outline" onClick={() => document.getElementById("banner-upload")?.click()}>
                            Upload
                        </Button>
                        <input
                            id="banner-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    const fakeUrl = URL.createObjectURL(e.target.files[0])
                                    setBannerUrl(fakeUrl)
                                }
                            }}
                        />
                    </div>
                </div>

                {bannerUrl && (
                    <div
                        className={`relative h-48 rounded-lg overflow-hidden flex ${bannerAlign === "center" ? "justify-center" : bannerAlign === "right" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <Image
                            width={1200}
                            height={400}
                            src={bannerUrl || "/placeholder.svg"}
                            alt="Banner preview"
                            className={`h-full ${bannerAlign === "center" ? "object-contain" : "object-cover"}`}
                        />
                        <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setBannerUrl("")}>
                            Remove
                        </Button>
                    </div>
                )}

                {previewMode ? (
                    <div className="border rounded-lg p-6">
                        <h1 className="text-4xl font-bold mb-6" style={{ textAlign: titleAlign }}>
                            {title}
                        </h1>
                        {bannerUrl && (
                            <div
                                className={`relative mb-8 rounded-lg overflow-hidden flex ${bannerAlign === "center"
                                    ? "justify-center"
                                    : bannerAlign === "right"
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                            >
                                <Image
                                    width={1200}
                                    height={400}
                                    src={bannerUrl || "/placeholder.svg"}
                                    alt={title}
                                    className={`h-[300px] ${bannerAlign === "center" ? "object-contain" : "object-cover"}`}
                                />
                            </div>
                        )}
                        <div className="prose max-w-none">
                            <BlogPreview content={content} />
                        </div>
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-medium mb-1">Content</label>
                        <div className="border rounded-lg min-h-[500px]">
                            <BlogEditor initialContent={content} onChange={setContent} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
