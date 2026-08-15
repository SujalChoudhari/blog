type PostAuthorData = {
  author?: string;
  authors?: string[];
};

const defaultAuthors = ["Sujal Choudhari"];

/** Read both legacy singular and current plural author frontmatter. */
const getPostAuthors = (data: PostAuthorData): string[] => {
  if (typeof data.author === "string" && data.author.trim()) {
    return [data.author.trim()];
  }

  const authors = Array.isArray(data.authors)
    ? data.authors.filter((author) => typeof author === "string" && author.trim())
    : [];

  return authors.length > 0 ? authors : defaultAuthors;
};

export default getPostAuthors;
