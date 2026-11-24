#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(import.meta.dirname, "..");
const postsDir = path.join(projectRoot, "src", "content", "posts");
const laneRegistryPath = path.join(projectRoot, "src", "config", "lane-registry.json");

function parseArgs(argv) {
  const options = {
    title: "",
    lane: "Technical",
    tags: ["engineering"],
    desc: "",
    category: "engineering",
    publish: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else if (arg === "--title" || arg === "-t") {
      options.title = argv[++i] || "";
    } else if (arg === "--lane" || arg === "-l") {
      const lane = argv[++i] || "Technical";
      if (!["Technical", "Writing", "Life"].includes(lane)) {
        console.error(`Invalid lane: "${lane}". Must be Technical, Writing, or Life.`);
        process.exit(1);
      }
      options.lane = lane;
    } else if (arg === "--tags") {
      const rawTags = argv[++i] || "";
      options.tags = rawTags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
    } else if (arg === "--desc" || arg === "-d") {
      options.desc = argv[++i] || "";
    } else if (arg === "--category" || arg === "-c") {
      options.category = (argv[++i] || "engineering").toLowerCase();
    } else if (arg === "--publish") {
      options.publish = true;
    } else if (!options.title && !arg.startsWith("-")) {
      options.title = arg;
    }
  }

  if (!options.title) {
    console.error("Error: --title is required.");
    printHelp();
    process.exit(1);
  }

  return options;
}

function printHelp() {
  console.log(`Usage:
  npm run post:new -- "My Post Title" [options]
  node scripts/new-post.mjs --title "My Post Title" [options]

Options:
  --title, -t <title>    Post title (required)
  --lane, -l <lane>      Lane: Technical | Writing | Life (default: Technical)
  --tags <tags>          Comma-separated list of tags (default: engineering)
  --desc, -d <desc>      Post meta description
  --category, -c <cat>   Category name (default: engineering)
  --publish              Set draft: false (default: draft is true)
  --help, -h             Show this help message`);
}

async function getNextPostNumber() {
  const files = await readdir(postsDir);
  let maxId = -1;

  for (const file of files) {
    const match = file.match(/^post(\d+)\.(md|mdx)$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxId) {
        maxId = num;
      }
    }
  }

  return maxId + 1;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const nextNum = await getNextPostNumber();
  const postId = `post${nextNum}`;
  const filename = `${postId}.mdx`;
  const postFilePath = path.join(postsDir, filename);

  const today = new Date().toISOString().split("T")[0];
  const tagsFormatted = JSON.stringify(options.tags.length > 0 ? options.tags : ["engineering"]);

  const content = `---
title: ${JSON.stringify(options.title)}
date: ${today}
description: ${JSON.stringify(options.desc || options.title)}
tags: ${tagsFormatted}
categories: ["${options.category}"]
image: "/images/posts/${nextNum}.jpg"
author: "Sujal Choudhari"
lane: "${options.lane}"
draft: ${options.publish ? "false" : "true"}
---

## Overview

${options.title}
`;

  await writeFile(postFilePath, content, "utf8");

  // Update lane-registry.json
  try {
    const registryRaw = await readFile(laneRegistryPath, "utf8");
    const registry = JSON.parse(registryRaw);
    if (!registry.some(r => r.id === postId)) {
      registry.push({
        id: postId,
        lane: options.lane,
        reason: options.desc || options.title
      });
      await writeFile(laneRegistryPath, JSON.stringify(registry, null, 2) + "\n", "utf8");
    }
  } catch (err) {
    console.warn(`Warning: Could not update lane-registry.json: ${err.message}`);
  }

  console.log(`\x1b[32m✔ Created new blog post:\x1b[0m ${path.relative(process.cwd(), postFilePath)}`);
  console.log(`  - ID: ${postId}`);
  console.log(`  - Lane: ${options.lane}`);
  console.log(`  - Draft: ${options.publish ? "false (published)" : "true (draft)"}`);
  console.log(`  - Tags: ${options.tags.join(", ")}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
