import { getSinglePage } from "@/lib/contentParser.astro";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const posts = await getSinglePage("posts");
  const searchIndex = posts
    .filter((post) => !post.id.startsWith("-index") && post.id !== "post18.mdx" && post.id !== "post18")
    .map((post) => ({
      id: post.id.replace(/\.mdx?$/, ""),
      title: post.data.title,
      description: post.data.description || "",
      tags: post.data.tags || [],
      categories: post.data.categories || [],
      date: post.data.date ? new Date(post.data.date).toISOString().split("T")[0] : "",
    }));

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
