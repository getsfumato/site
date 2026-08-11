/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // People do read install scripts before piping them to a shell — serve it
        // as text so the browser renders it instead of downloading it.
        source: '/install.sh',
        headers: [
          { key: 'Content-Type', value: 'text/plain; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
      {
        // The page-plugin registry the CLI fetches. Served from here rather than
        // from a branch on the code repository because it is a trust root: it
        // carries both the URL each plugin is downloaded from and the sha256 that
        // validates it, so whoever can write it can make an installed CLI fetch and
        // execute arbitrary JavaScript. That belongs somewhere deliberately
        // deployed, not on the branch the repository pushes to daily.
        //
        // Short-lived cache, not immutable: correcting a bad URL or hash for
        // binaries already installed is the whole reason it is fetched at all.
        source: '/page-plugin-registry.json',
        headers: [
          { key: 'Content-Type', value: 'application/json; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=300, must-revalidate' },
        ],
      },
      {
        source: '/img/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
        ],
      },
    ];
  },
};

export default nextConfig;
