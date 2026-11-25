import { getSinglePage } from "@/lib/contentParser.astro";
import type { APIRoute } from "astro";

function cleanMarkdown(raw?: string): string {
  if (!raw) return "";
  return raw
    .replace(/^---[\s\S]*?---\s*/, "") // Frontmatter
    .replace(/```[\s\S]*?```/g, " ") // Code blocks
    .replace(/`([^`]+)`/g, "$1") // Inline code
    .replace(/import\s+.*?from\s+['"][^'"]*['"];?/g, " ") // MDX imports
    .replace(/export\s+.*?from\s+['"][^'"]*['"];?/g, " ") // MDX exports
    .replace(/<[^>]+>/g, " ") // HTML / MDX tags
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links -> text
    .replace(/^#{1,6}\s+/gm, "") // Heading hashes
    .replace(/^[\s*>+-]+/gm, " ") // Blockquotes and list markers
    .replace(/[_*~`]/g, " ") // Markdown styling symbols
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
}

export const GET: APIRoute = async () => {
  const posts = await getSinglePage("posts");
  const searchIndex = posts
    .filter((post) => !post.id.startsWith("-index") && post.id !== "post18.mdx" && post.id !== "post18")
    .map((post) => {
      const cleanBody = cleanMarkdown(post.body);
      return {
        id: post.id.replace(/\.mdx?$/, ""),
        title: post.data.title,
        description: post.data.description || "",
        tags: post.data.tags || [],
        categories: post.data.categories || [],
        lane: post.data.lane || "",
        date: post.data.date ? new Date(post.data.date).toISOString().split("T")[0] : "",
        content: cleanBody.slice(0, 800),
      };
    });

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
