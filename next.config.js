/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.seadn.io',
      'openseauserdata.com',
      'lh3.googleusercontent.com',
      'images.pexels.com'
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;