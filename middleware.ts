// import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

// Initialize the rate limiter
const ratelimit = new Ratelimit({
  redis: kv,
  // Allow 5 requests per IP in a 10-second window
  limiter: Ratelimit.slidingWindow(5, '10 s'),
});

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "";
  const ip = request.ip ?? '127.0.0.1';

  // Rate limiting check
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip);
  if (!success) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  // Manual check for .php in URL
  if (url.pathname.includes(".php")) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // Basic bot detection
  const isBot = /bot|crawl|slurp|spider|robot|crawling/i.test(userAgent);
  if (isBot) {
    return NextResponse.rewrite(new URL(`/bots${url.pathname}`, request.url));
  }

  // Rewrites for app pages
  const hostname = request.headers.get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    const session = await getToken({ req: request });
    if (!session && url.pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", request.url));
    } else if (session && url.pathname == "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.rewrite(
      new URL(`/app${url.pathname === "/" ? "" : url.pathname}`, request.url),
    );
  }

  // Rewrite root application to `/home` folder
  if (
    hostname === "localhost:3002" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(new URL(`/home${url.pathname}`, request.url));
  }

  // Special case for `vercel.pub` domain
  if (hostname === "vercel.pub") {
    return NextResponse.redirect(
      "https://vercel.com/blog/platforms-starter-kit",
    );
  }

  // Rewrite everything else to `/[domain]/[path]` dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}`, request.url));
}




// export const config = {
//   matcher: [
//     "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
//   ],
// };

// export default async function middleware(req: NextRequest) {
//   const url = req.nextUrl;
//   const hostname = req.headers
//     .get("host")!
//     .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

//   // Basic bot detection
//   const userAgent = req.headers.get("user-agent") || "";
//   const isBot = /bot|crawl|slurp|spider|robot|crawling/i.test(userAgent);

//   // Manual check for .php in URL
//   if (url.pathname.includes(".php")) {
//     return new NextResponse("Bad Request", { status: 400 });
//   }

//   if (isBot) {
//     return NextResponse.rewrite(new URL(`/bots${url.pathname}`, req.url));
//   }

//   // Rewrites for app pages
//   if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
//     const session = await getToken({ req });
//     if (!session && url.pathname !== "/login") {
//       return NextResponse.redirect(new URL("/login", req.url));
//     } else if (session && url.pathname == "/login") {
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//     return NextResponse.rewrite(
//       new URL(`/app${url.pathname === "/" ? "" : url.pathname}`, req.url),
//     );
//   }

//   // Rewrite root application to `/home` folder
//   if (
//     hostname === "localhost:3002" ||
//     hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
//   ) {
//     return NextResponse.rewrite(new URL(`/home${url.pathname}`, req.url));
//   }

//   // Special case for `vercel.pub` domain
//   if (hostname === "vercel.pub") {
//     return NextResponse.redirect(
//       "https://vercel.com/blog/platforms-starter-kit",
//     );
//   }

//   // Rewrite everything else to `/[domain]/[path]` dynamic route
//   return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}`, req.url));
// }


