const fs = require("fs");
const path = require("path");

// RSS Feed Constants
const POSTS_DIR = path.resolve(__dirname, "./src/content/posts/");
const SITE_URL = "https://www.sujal.xyz";
const RSS_PATH = path.resolve(__dirname, "./public/rss.xml");
const SITEMAP_PATH = path.resolve(__dirname, "./public/sitemap.xml");

function parseMetadata(content) {
  const metadataRegex = /---\s*([\s\S]*?)\s*---/;
  const match = metadataRegex.exec(content);

  if (!match) {
    throw new Error("Metadata block not found in content");
  }

  const metadata = match[1];
  const parsedMetadata = {};

  metadata.split("\n").forEach((line) => {
    const [key, ...value] = line.split(":");
    if (key && value) {
      parsedMetadata[key.trim()] = value
        .join(":")
        .trim()
        .replace(/(^"|"$)/g, "");
    }
  });

  if (parsedMetadata.tag) {
    parsedMetadata.tag = parsedMetadata.tag
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((tag) => tag.trim());
  }

  return parsedMetadata;
}

function generateRSSItem(postId, metadata) {
  const postLink = `${SITE_URL}/posts/${postId}`;
  return `
    <item>
      <title>${metadata.title}</title>
      <link>${postLink}</link>
      <description>${metadata.description}</description>
      <pubDate>${new Date(metadata.date).toUTCString()}</pubDate>
      <author>${metadata.authorEmail || "rss@sujal.xyz"} (${metadata.author})</author>
      <guid>${postLink}</guid>
    </item>
  `;
}

function generateRSSFeed() {
  const files = fs.readdirSync(POSTS_DIR);
  const posts = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(POSTS_DIR, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const postId = path.basename(file, ".mdx");

      try {
        const metadata = parseMetadata(content);
        return { postId, metadata };
      } catch (error) {
        console.error(`Error parsing file ${file}:`, error.message);
        return null;
      }
    })
    .filter(Boolean);

  posts.sort((a, b) => new Date(b.metadata.date) - new Date(a.metadata.date));

  const rssItems = posts
    .map(({ postId, metadata }) => generateRSSItem(postId, metadata))
    .join("\n");

  const rssFeed = `
      <?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
          <title>Sujal's Blog</title>
          <link>${SITE_URL}</link>
          <description>Latest updates from Sujal's blog</description>
          <language>en-us</language>
          <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
          <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
          ${rssItems}
        </channel>
      </rss>
    `;

  fs.writeFileSync(RSS_PATH, rssFeed.trim());
  console.log(`RSS feed generated at ${RSS_PATH}`);
}

function generateSitemap() {
  const files = fs.readdirSync(POSTS_DIR);
  const posts = files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(POSTS_DIR, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const postId = path.basename(file, ".mdx");

      try {
        const metadata = parseMetadata(content);
        return { postId, metadata };
      } catch (error) {
        console.error(`Error parsing file ${file}:`, error.message);
        return null;
      }
    })
    .filter(Boolean);

  const sitemapEntries = posts.map(({ postId, metadata }) => {
    const postLink = `${SITE_URL}/posts/${postId}`;
    const lastmod = new Date(metadata.date).toISOString();
    return `
        <url>
          <loc>${postLink}</loc>
          <lastmod>${lastmod}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
        </url>
      `;
  });

  const sitemap = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${SITE_URL}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>1.0</priority>
        </url>
        ${sitemapEntries.join("\n")}
      </urlset>
    `;

  fs.writeFileSync(SITEMAP_PATH, sitemap.trim());
  console.log(`Sitemap generated at ${SITEMAP_PATH}`);
}

generateRSSFeed();
generateSitemap();
