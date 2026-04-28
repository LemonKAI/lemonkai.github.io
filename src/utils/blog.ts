import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;
export type BlogLang = BlogPost["data"]["lang"];
export type BlogKind = BlogPost["data"]["kind"];

export async function getSortedPosts() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return sortPosts(posts);
}

export function sortPosts(posts: BlogPost[]) {
  return [...posts].sort(
    (left, right) =>
      right.data.pubDate.getTime() - left.data.pubDate.getTime()
  );
}

export function sortSeriesPosts(posts: BlogPost[]) {
  return [...posts].sort((left, right) => {
    const leftOrder = left.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return right.data.pubDate.getTime() - left.data.pubDate.getTime();
  });
}

export function formatDate(date: Date, lang: BlogLang = "en") {
  return new Intl.DateTimeFormat(lang === "zh" ? "zh-HK" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function languageLabel(lang: BlogLang) {
  return lang === "zh" ? "中文" : "EN";
}

export function kindLabel(kind: BlogKind, lang: BlogLang = "en") {
  const labels = {
    zh: {
      series: "系列",
      note: "小知識",
      incident: "事故筆記"
    },
    en: {
      series: "Series",
      note: "Note",
      incident: "Incident"
    }
  } as const;

  return labels[lang][kind];
}

export function tagToSlug(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function postUrl(post: BlogPost) {
  return `/blog/${post.slug}/`;
}

export function getPostsByLang(posts: BlogPost[], lang: BlogLang) {
  return posts.filter((post) => post.data.lang === lang);
}

export function getPostsByKind(posts: BlogPost[], kind: BlogKind) {
  return posts.filter((post) => post.data.kind === kind);
}

export function getSeriesPosts(posts: BlogPost[], series?: string) {
  return posts.filter(
    (post) =>
      post.data.kind === "series" &&
      (series ? post.data.series === series : Boolean(post.data.series))
  );
}

export function findTranslation(posts: BlogPost[], currentPost: BlogPost) {
  const key = currentPost.data.translationKey;

  if (!key) {
    return undefined;
  }

  return posts.find(
    (post) =>
      post.id !== currentPost.id &&
      post.data.translationKey === key &&
      post.data.lang !== currentPost.data.lang
  );
}

export function getUniqueTags(posts: BlogPost[]) {
  return [...new Set(posts.flatMap((post) => post.data.tags))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function getTagCounts(posts: BlogPost[]) {
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0]);
    })
    .map(([tag, count]) => ({ tag, count }));
}
