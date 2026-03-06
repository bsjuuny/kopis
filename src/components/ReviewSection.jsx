import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchReviews } from '../services/reviewApi';

const ReviewContainer = styled.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
`;

const ReviewTitle = styled.h3`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #ffffff;

  &::before {
    content: '';
    display: block;
    width: 6px;
    height: 28px;
    background-color: var(--primary-color);
    border-radius: 3px;
  }
`;

const LoadingText = styled.div`
  color: var(--text-color-light);
  font-size: 0.9rem;
  text-align: center;
  padding: 20px 0;
`;

const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ReviewCard = styled.a`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background-color: var(--surface-color);
  text-decoration: none;
  color: var(--text-color);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: var(--primary-color);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const BloggerName = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary-color);
`;

const ReviewDate = styled.span`
  font-size: 0.75rem;
  color: var(--text-color-light);
`;

const CardTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardDesc = styled.p`
  font-size: 0.85rem;
  color: var(--text-color-light);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  font-size: 1.1rem;
  font-weight: 500;
`;

const ReviewSection = ({ performanceTitle }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReviews = async () => {
      setLoading(true);
      if (performanceTitle) {
        // 검색어 최적화: 제목 + "공연 후기"에 영화, 드라마, 넷플릭스 제외
        const query = `"${performanceTitle}" 연극 뮤지컬 공연 후기 -영화 -드라마 -넷플릭스 -웹툰`;
        const data = await fetchReviews(query, 6, performanceTitle);
        setReviews(data);
      }
      setLoading(false);
    };

    getReviews();
  }, [performanceTitle]);

  if (!performanceTitle) return null;

  return (
    <ReviewContainer>
      <ReviewTitle>블로그 관람 후기</ReviewTitle>

      {loading ? (
        <LoadingText>후기를 불러오는 중입니다...</LoadingText>
      ) : reviews.length > 0 ? (
        <ReviewGrid>
          {reviews.map((review, index) => (
            <ReviewCard href={review.link} target="_blank" rel="noopener noreferrer" key={index}>
              <CardHeader>
                <BloggerName>{review.blogger}</BloggerName>
                <ReviewDate>{review.date}</ReviewDate>
              </CardHeader>
              <CardTitle dangerouslySetInnerHTML={{ __html: review.title }} />
              <CardDesc dangerouslySetInnerHTML={{ __html: review.description }} />
            </ReviewCard>
          ))}
        </ReviewGrid>
      ) : (
        <EmptyState>최근 등록된 블로그 후기가 없습니다.</EmptyState>
      )}
    </ReviewContainer>
  );
};

export default ReviewSection;
