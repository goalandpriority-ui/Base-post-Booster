/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'ALLOWALL' },
          {
            key: 'Content-Security-Policy',
            value:
              "frame-ancestors 'self' https://warpcast.com https://*.farcaster.xyz;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
