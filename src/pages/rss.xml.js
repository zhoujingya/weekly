import rss from "@astrojs/rss";
export async function GET() {
  let allPosts = import.meta.glob("./posts/*.md", { eager: true });
  let posts = Object.values(allPosts);

  posts = posts.sort((a, b) => {
    const getPostNumber = (url) =>
      parseInt(url.split("/posts/")[1].split("-")[0]);
    return getPostNumber(b.url) - getPostNumber(a.url);
  });

  // Only 12 are kept
  posts = posts.slice(0, 12);

  // 处理 Markdown 内容，返回不过滤的标签的原始内容
  const processContent = async (item) => {
    const content = await item.compiledContent();
    return content;
  };

  return rss({
    title: "Blogs",
    description: "记录工程师 ZhouJing 的不枯燥生活",
    site: "https://zhoujingya.github.io/",
    customData: `<image><url>https://zhoujingya.github.io/favicon.ico</url></image><follow_challenge><feedId>41147805276726275</feedId><userId>42909600318350336</userId></follow_challenge>`,
    items: await Promise.all(
      posts.map(async (item) => {
        const [issueNumber, issueTitle] = item.url
          .split("/posts/")[1]
          .split("-");
        const title = `第${issueNumber}期 - ${issueTitle}`;
        return {
          link: item.url,
          title,
          description: await processContent(item),
          pubDate: item.frontmatter.date,
        };
      }),
    ),
  });
}
