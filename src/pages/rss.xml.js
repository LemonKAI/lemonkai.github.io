import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { getSortedPosts, postUrl } from "../utils/blog";

export async function GET(context) {
  const posts = await getSortedPosts();

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post)
    })),
    customData: "<language>zh-hk</language>"
  });
}
