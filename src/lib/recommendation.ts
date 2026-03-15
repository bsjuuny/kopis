import { KOPISPerformance } from '@/types';

interface UserPreference {
  genres: Record<string, number>;
  totalFavorites: number;
}

/**
 * 사용자 찜 목록을 바탕으로 장르 선호도 프로필 생성
 */
function buildPreferenceProfile(favorites: KOPISPerformance[]): UserPreference {
  const genres: Record<string, number> = {};
  
  favorites.forEach((fav) => {
    if (fav.genre) {
      genres[fav.genre] = (genres[fav.genre] || 0) + 1;
    }
  });

  return {
    genres,
    totalFavorites: favorites.length,
  };
}

/**
 * 단일 공연에 대한 추천 점수 계산 (0 ~ 100)
 */
function calculateScore(performance: KOPISPerformance, profile: UserPreference): number {
  if (profile.totalFavorites === 0) return 0;
  
  let score = 0;
  
  // 장르 일치도 점수 (최대 80점)
  // 사용자가 찜한 전체 대비 해당 장르의 비율을 점수화
  if (performance.genre && profile.genres[performance.genre]) {
    const genreRatio = profile.genres[performance.genre] / profile.totalFavorites;
    score += genreRatio * 80;
  }

  // 데이터 품질 점수 (최대 20점)
  // 포스터가 있는 경우 등 기본 신뢰도 가산
  if (performance.poster) score += 20;

  return score;
}

/**
 * 개인화 추천 공연 리스트 반환
 * @param allPerformances 현재 로드된 공연 리스트 풀
 * @param favorites 사용자가 찜한 공연 리스트
 * @param limit 추천 상위 N개
 */
export function getPersonalizedRecommendations(
  allPerformances: KOPISPerformance[],
  favorites: KOPISPerformance[],
  limit: number = 6
): KOPISPerformance[] {
  if (favorites.length === 0) return [];

  const profile = buildPreferenceProfile(favorites);
  const favoriteIds = new Set(favorites.map(f => f.id));

  return allPerformances
    .filter(p => !favoriteIds.has(p.id)) // 이미 찜한 것은 제외
    .map(p => ({
      performance: p,
      score: calculateScore(p, profile)
    }))
    .filter(item => item.score > 0) // 점수가 있는 것매
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.performance);
}

/**
 * 추천 사유 리턴 (익스플레인 UI용)
 */
export function getRecommendationReason(performance: KOPISPerformance, favorites: KOPISPerformance[]): string {
  if (favorites.length === 0) return "";
  
  const profile = buildPreferenceProfile(favorites);
  const genreCount = profile.genres[performance.genre] || 0;
  
  if (genreCount > 0) {
    return `평소 선호하시는 ${performance.genre} 장르의 공연이에요!`;
  }
  
  return "새로운 취향을 발견해 보세요!";
}
