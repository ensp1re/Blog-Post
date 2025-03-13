/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import "./globals.css"

export default function Home() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    // Load posts from localStorage
    const savedPosts = localStorage.getItem("blogPosts")
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts))
      } catch (error) {
        console.error("Error loading posts:", error)
      }
    }
  }, [])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Blog</h1>
        <Link href="/editor/new">
          <Button>Create New Post</Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">No posts yet</h2>
          <p className="text-gray-500 mb-6">Create your first blog post to get started</p>
          <Link href="/editor/new">
            <Button>Create New Post</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="h-48 bg-gray-100 relative">
                <Image
                  width={400}
                  height={200}
                  src={post.bannerUrl || "/placeholder.svg?height=200&width=400"}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <div className="text-sm text-gray-500 mb-4">{new Date(post.updatedAt).toLocaleDateString()}</div>
                <div className="flex gap-2">
                  <Link href={`/view/${post.id}`}>
                    <Button variant="outline" size="sm">
                      View Post
                    </Button>
                  </Link>
                  <Link href={`/editor/${post.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

