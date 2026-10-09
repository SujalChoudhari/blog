---
name: storyscope
description: Write and publish a researched technical blog post in the established Sujal Choudhari blog voice. Use for assigned editorial work in this repository; do not use for generic marketing copy or unapproved external publication.
metadata:
  short-description: Research, write, verify, and publish blog posts
---

# Storyscope

Create essays that make one precise technical or product claim, then test that
claim against a concrete system, project, incident, paper, or release. The
purpose is not to restate news. It is to leave the reader with a clearer model
of where a system's promise ends.

## Read the local evidence first

Before drafting, read the newest posts in `src/content/posts/`, the collection
schema in `src/content.config.ts`, and relevant local project documentation.
Treat recent posts as the primary voice reference. The normal current format is
an MDX post with title, date, description, 4--6 lower-case tags, category,
`author: Sujal Choudhari`, and an explicit `draft` value.

## Voice and structure

- Lead with the claim in plain language. Prefer a memorable contrast such as
  “a report is not a state transition” over a catalogue of features.
- Explain the mechanism with specific facts. Separate facts, reasonable
  inferences, and open questions.
- Use first person only for genuine observation or experience; do not invent
  experiments, access, opinions, or quotations.
- Build the middle around 3--5 meaningful sections. Use short paragraphs and
  headings that advance the argument.
- Name boundaries, failure modes, ownership, verification, and recovery where
  they matter. Do not use hype, generic AI claims, or filler conclusions.
- End by restating the operational consequence, not by repeating the opening.
- Add a `## Sources` section for externally verifiable factual claims. Link
  original papers, project documentation, and primary announcements before
  commentary. Do not fabricate citations or claim freshness without checking.

## Repository and publishing rules

- Choose the next unused `post<N>.mdx` name; never overwrite an existing post.
- Keep frontmatter valid for the local content schema. Use `Engineering` when
  the subject is technical unless the subject clearly belongs to another
  existing category.
- Set `draft: true` unless the assigned issue explicitly asks to publish or the
  owner has approved publication in that issue. A writing request alone is not
  publication approval.
- Before handoff, run `npm run build` and repair content errors. Inspect the
  diff for frontmatter, links, filename, and accidental unrelated changes.
- When publication is authorized, commit only the relevant editorial files and
  push to the repository's configured default branch. Report the commit SHA and
  build result in the issue. Never force-push, rewrite history, or publish a
  draft without authorization.

## Quality bar

The post is not done when it merely sounds like a technical blog. It must have
a distinct thesis, defensible evidence, correctly shaped frontmatter, a clean
build, and a reader-useful conclusion. If a required fact cannot be verified,
remove it, qualify it, or leave the post in draft and state what is missing.
