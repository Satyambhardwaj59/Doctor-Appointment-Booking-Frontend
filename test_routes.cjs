const http = require('http');

const routes = [
  '/',
  '/doctors',
  '/about',
  '/contact',
  '/login',
  '/robots.txt',
  '/sitemap.xml',
  '/doctors/General%20physician'
];

async function checkRoute(r) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + r, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        const titleMatch = data.match(/<title>([^<]+)<\/title>/);
        const title = titleMatch ? titleMatch[1] : (r.includes('xml') ? 'Sitemap XML' : (r.includes('txt') ? 'Robots TXT' : 'No Title'));
        const descMatch = data.match(/<meta name="description" content="([^"]+)"/);
        const desc = descMatch ? descMatch[1].substring(0, 40) + '...' : 'N/A';
        resolve({
          route: r,
          status: res.statusCode,
          title,
          description: desc
        });
      });
    }).on('error', (e) => resolve({ route: r, error: e.message }));
  });
}

(async () => {
  console.log('=== VERIFYING NEXT.JS 16 ROUTES & SEO METADATA ===');
  for (const r of routes) {
    const res = await checkRoute(r);
    if (res.error) {
      console.log(`❌ ${r}: ${res.error}`);
    } else {
      console.log(`✅ [${res.status}] ${res.route.padEnd(30)} | Title: "${res.title}" | Desc: "${res.description}"`);
    }
  }
})();
