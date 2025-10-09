/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: '127.0.0.1',
          port: '8000',
          pathname: '/profiles/**',
        },
        {
          protocol:'https',
          hostname: 'recos-7bb46015fb57.herokuapp.com',
          pathname: '/profiles/**',
        }
      ],
    },
  }
  
  module.exports = nextConfig;
  