import config from "@/config/config.json";
import { getSinglePage } from "@/lib/contentParser.astro";
import { sortByDate } from "@/lib/utils/sortFunctions";

function escapeXml(unsafe: string | undefined): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getSinglePage("posts");
  const sortedPosts = sortByDate(posts);

  const siteUrl = config.site.base_url;
  const title = config.site.title;
  const description = config.metadata.meta_description;
  const author = config.metadata.meta_author;
  const email = config.contactinfo.email;

  const fallbackDate = new Date().toUTCString();
  const lastBuildDate =
    sortedPosts.length > 0 && sortedPosts[0].data.date
      ? new Date(sortedPosts[0].data.date).toUTCString()
      : fallbackDate;

  const itemsXml = sortedPosts
    .map((post: any) => {
      const postUrl = `${siteUrl}/${post.id}`;
      const postTitle = escapeXml(post.data.title);
      const postDescription = escapeXml(post.data.description || "");
      const pubDate = post.data.date
        ? new Date(post.data.date).toUTCString()
        : fallbackDate;

      return `    <item>
      <title>${postTitle}</title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <description>${postDescription}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(email)} (${escapeXml(author)})</author>
    </item>`;
    })
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
