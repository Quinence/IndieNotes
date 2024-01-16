export const loader = async () => {
  const blogSlugs = await getBlogSlugs();

  const staticPages = ["/", "/about", "/contact", "/services"];

  const baseUrl = "https://example.com";

  const sitemap = `
    <urlset
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                                                http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
        ${blogSlugs
          .map(
            (slug) => `
                <url>
                        <loc>${`${baseUrl}/${slug}`}</loc>
                </url>
        `,
          )
          .join("")}
        ${staticPages
          .map(
            (page) => `
                <url>
                        <loc>${`${baseUrl}${page}`}</loc>
                </url>
        `,
          )
          .join("")}
    </urlset>`;
  console.log(sitemap);
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};

const getBlogSlugs = async () => {
  return ["what-is-javascript", "what-is-typescript"];
};
