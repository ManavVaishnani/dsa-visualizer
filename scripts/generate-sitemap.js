import fs from 'fs';
import path from 'path';

const DOMAIN = 'https://algoflow.com';
const ROUTES = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/algorithms', priority: '0.9', changefreq: 'weekly' },
    { path: '/sorting', priority: '0.8', changefreq: 'weekly' },
    { path: '/searching', priority: '0.8', changefreq: 'weekly' },
    { path: '/graphs', priority: '0.8', changefreq: 'weekly' },
    { path: '/visualize/bubble-sort', priority: '0.7', changefreq: 'monthly' },
    { path: '/visualize/selection-sort', priority: '0.7', changefreq: 'monthly' },
    { path: '/visualize/insertion-sort', priority: '0.7', changefreq: 'monthly' },
    { path: '/visualize/merge-sort', priority: '0.7', changefreq: 'monthly' },
    { path: '/visualize/quick-sort', priority: '0.7', changefreq: 'monthly' },
    { path: '/visualize/linear-search', priority: '0.7', changefreq: 'monthly' },
    { path: '/visualize/binary-search', priority: '0.7', changefreq: 'monthly' },
    { path: '/visualize/bfs', priority: '0.7', changefreq: 'monthly' },
    { path: '/visualize/dfs', priority: '0.7', changefreq: 'monthly' },
];

function generateSitemap() {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((route) => `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    const publicDir = path.resolve('public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated at public/sitemap.xml');
}

generateSitemap();
