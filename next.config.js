/**
 * @type {import('next').NextConfig}
 */
module.exports = {
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ige9ec25vizexnyy.public.blob.vercel-storage.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "public.blob.vercel-storage.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "abs.twimg.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "flag.vercel.app",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "illustrations.popsy.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "pub-dbc0ea453a75414bb37379de04191eb2.r2.dev",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "**",
      },
      {
        protocol:"https",
        hostname:"typedd.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "**",
      },
    ],
  },
  // images: {
  //   domains: [
  //     "ige9ec25vizexnyy.public.blob.vercel-storage.com",
  //     "public.blob.vercel-storage.com",
  //     "res.cloudinary.com",
  //     "abs.twimg.com",
  //     "pbs.twimg.com",
  //     "avatars.githubusercontent.com",
  //     "www.google.com",
  //     "flag.vercel.app",
  //     "images.unsplash.com",
  //     "illustrations.popsy.co",
  //     "lh3.googleusercontent.com",
  //     "pub-dbc0ea453a75414bb37379de04191eb2.r2.dev",
  //     "storage.googleapis.com",
  //     "images.pexels.com",
  //   ],
  // },
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version,Authorization",
          },
        ],
      },
    ];
    
  },
};
