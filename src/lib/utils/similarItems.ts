// similer products
const similarItems = (currentItem: any, allItems: any, slug: string) => {
  const currentCategories: string[] = (
    currentItem.data?.categories || []
  ).map((c: string) => c.toLowerCase());

  // Filter by categories
  const filteredByCategories = allItems.filter((item: any) => {
    if (!item.data?.categories) return false;
    if (item.slug === slug) return false; // Exclude current item

    return item.data.categories.some((category: string) =>
      currentCategories.includes(category.toLowerCase()),
    );
  });

  // Sort by date (newest first)
  const sortedItems = filteredByCategories.sort(
    (a: any, b: any) =>
      new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  return sortedItems;
};

export default similarItems;
