import axios from "axios";

const PROXY_URL = process.env.NODE_ENV === "development" ? "/kopis/naver-api" : "/kopis/naver_proxy.php";

export interface Review {
  title: string;
  description: string;
  link: string;
  blogger: string;
  date: string;
}

function extractSearchKeyword(title: string): string {
  // 0. [지역] 접두어 제거
  const withoutRegion = title.replace(/^\[[^\]]*\]\s*/, "").trim();
  const base = withoutRegion || title;

  // 1. 《》「」『』〈〉 안 내용 우선 추출
  const bookTitle = base.match(/[《「『〈](.*?)[》」』〉]/)?.[1]?.trim();
  if (bookTitle && bookTitle.length >= 2) return bookTitle;

  // 2. 장식 괄호 제거, ( [ 【 （ 앞까지 추출
  const cleaned = base.replace(/[《》「」『』〈〉]/g, "").trim();
  const beforeParen = cleaned.split(/[([\u3010\uff08]/)[0].trim();
  const keyword = beforeParen || cleaned;

  if (keyword.length <= 20) return keyword;

  // 3. 어절 경계에서 ~18자 이내로 자르기
  const words = keyword.split(" ");
  let result = "";
  for (const word of words) {
    if ((result + " " + word).trim().length > 18) break;
    result = (result + " " + word).trim();
  }
  return result || keyword.slice(0, 18);
}

export const fetchReviews = async (performanceTitle: string, display = 10): Promise<Review[]> => {
  if (!performanceTitle) return [];

  const keyword = extractSearchKeyword(performanceTitle);
  const query = `${keyword} 후기`;
  const fetchCount = Math.min(display * 4, 100);

  try {
    const response = await axios.get(PROXY_URL, {
      params: {
        query,
        display: fetchCount,
        sort: "date",
      },
    });

    if (!response.data?.items) return [];

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const normalize = (s: string) =>
      s.replace(/<[^>]+>/g, "").replace(/\s+/g, "").toLowerCase();

    // 키워드를 개별 단어로 분리해 각각 포함 여부 확인 (붙여쓰기 이슈 방지)
    const keywordParts = keyword
      .split(/\s+/)
      .map((w) => w.toLowerCase())
      .filter((w) => w.length >= 1);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filtered = response.data.items.filter((item: any) => {
      // 날짜 필터: 6개월 이내
      const dateRaw: string = item.postdate || "";
      if (dateRaw.length === 8) {
        const postDate = new Date(
          `${dateRaw.slice(0, 4)}-${dateRaw.slice(4, 6)}-${dateRaw.slice(6, 8)}`
        );
        if (postDate < sixMonthsAgo) return false;
      }

      // 제목+본문 합산 텍스트에 키워드 단어 모두 포함 여부
      const normText =
        normalize(item.title || "") + normalize(item.description || "");
      return keywordParts.every((part) => normText.includes(part));
    });

    const decodeHtml = (s: string) =>
      s.replace(/<[^>]+>/g, "")
       .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
       .replace(/&amp;/g, "&").replace(/&quot;/g, '"')
       .replace(/&#39;/g, "'").replace(/&apos;/g, "'");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return filtered.slice(0, display).map((item: any) => {
      const dateRaw: string = item.postdate || "";
      return {
        title: decodeHtml(item.title || ""),
        description: decodeHtml(item.description || ""),
        link: item.link,
        blogger: item.bloggername,
        date:
          dateRaw.length === 8
            ? `${dateRaw.slice(0, 4)}.${dateRaw.slice(4, 6)}.${dateRaw.slice(6, 8)}`
            : dateRaw,
      };
    });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return [];
  }
};
