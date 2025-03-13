/* eslint-disable @typescript-eslint/no-explicit-any */
// This file contains the API functions to interact with the backend

export async function savePost(postData: any) {
  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error("Failed to save post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving post:", error);
    throw error;
  }
}

export async function getPost(id: string) {
  try {
    const response = await fetch(`/api/posts/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}

export async function getPosts() {
  try {
    const response = await fetch("/api/posts");

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function deletePost(id: string) {
  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}
