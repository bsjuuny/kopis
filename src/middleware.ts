import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (process.env.NODE_ENV === "development") {
    // KOPIS API proxy (개발 서버 전용). 배포본은 public/proxy.php 가 같은 일을 한다.
    // 키는 서버 쪽 KOPIS_API_KEY 로만 붙인다 — 브라우저 코드(api.ts)는 키를 보내지 않는다(2026-09-30).
    const kopisMatch = pathname.match(/\/api(\/pblprfr(?:\/[A-Za-z0-9]+)?)$/);
    if (kopisMatch) {
      // 옛 이름은 .env 정리(마지막 삭제 단계) 전까지만 예비로 읽는다.
      const SERVICE_KEY = process.env.KOPIS_API_KEY || process.env.NEXT_PUBLIC_KOPIS_API_KEY || "";
      const url = new URL(`https://www.kopis.or.kr/openApi/restful${kopisMatch[1]}`);
      searchParams.forEach((v, k) => url.searchParams.set(k, v));
      url.searchParams.set("service", SERVICE_KEY);
      try {
        const response = await fetch(url.toString(), { cache: "no-store" });
        return new NextResponse(await response.text(), {
          status: response.status,
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      } catch (error) {
        console.error("[Middleware] KOPIS proxy failed:", error);
        return new NextResponse("KOPIS proxy failed", { status: 500 });
      }
    }

    // Naver Blog Search API proxy
    // pathname may include basePath (/kopis) depending on Next.js version
    if (pathname.includes("/naver-api")) {
      // 서버 전용 이름을 먼저 읽는다. NEXT_PUBLIC_ 이름은 마지막 삭제 단계 전까지만 예비로 남긴다.
      const CLIENT_ID = process.env.NAVER_CLIENT_ID || process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || "";
      const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET || process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET || "";

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
  matcher: ["/naver-api", "/kopis/naver-api", "/api/:path*", "/kopis/api/:path*"],
};
