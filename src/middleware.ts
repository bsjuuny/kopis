import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (process.env.NODE_ENV === "development") {
    // Naver Blog Search API proxy
    // pathname may include basePath (/kopis) depending on Next.js version
    if (pathname.includes("/naver-api")) {
      const CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || "";
      const CLIENT_SECRET = process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET || "";

      const url = new URL("https://openapi.naver.com/v1/search/blog.json");
      searchParams.forEach((v, k) => url.searchParams.set(k, v));

      try {
        const response = await fetch(url.toString(), {
          headers: {
            "X-Naver-Client-Id": CLIENT_ID,
            "X-Naver-Client-Secret": CLIENT_SECRET,
          },
          cache: "no-store",
        });

        const text = await response.text();

        let data: unknown;
        try {
          data = JSON.parse(text);
        } catch {
          console.error("[Middleware] Naver API non-JSON:", text.substring(0, 200));
          return NextResponse.json({ error: "Naver API error", items: [] }, { status: response.status });
        }

        return NextResponse.json(data, {
          status: response.status,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      } catch (error) {
        console.error("[Middleware] Naver proxy failed:", error);
        return NextResponse.json({ error: "Naver proxy failed", items: [] }, { status: 500 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // basePath(/kopis) 포함 경로와 미포함 경로 모두 커버
  matcher: ["/naver-api", "/kopis/naver-api"],
};
