import axios from 'axios';

// Development: Proxy via Vite config to avoid CORS
// Production: Use the PHP proxy located in the same directory
const PROXY_URL = import.meta.env.DEV ? '/naver-api' : '/kopis/naver_proxy.php';

/**
 * Fetch reviews from Naver Blog Search API via Proxy
 * @param {string} keyword Search query (e.g., Performance Title + " 후기")
 * @param {number} display Number of results (default 5)
 * @returns {Promise<Array>} List of review objects
 */
export const fetchReviews = async (keyword, display = 5, filterTitle = '') => {
    if (!keyword) return [];

    try {
        const response = await axios.get(PROXY_URL, {
            params: {
                query: keyword,
                display: 50, // Fetch more to ensure we have enough after filtering
                sort: 'sim' // 'sim' for relevance, 'date' for recent
            }
        });

        if (response.data && response.data.items) {
            // Get date 1 month ago
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

            const filteredAndMapped = response.data.items.filter(item => {
                const dateRaw = item.postdate || '';
                if (dateRaw.length === 8) {
                    const postDate = new Date(`${dateRaw.slice(0, 4)}-${dateRaw.slice(4, 6)}-${dateRaw.slice(6, 8)}`);
                    if (postDate < oneMonthAgo) return false;
                }

                if (filterTitle) {
                    const strippedTitle = item.title.replace(/<[^>]+>/g, '');
                    const normalizedFilterTitle = filterTitle.replace(/\s+/g, '').toLowerCase();
                    const normalizedBlogTitle = strippedTitle.replace(/\s+/g, '').toLowerCase();
                    if (!normalizedBlogTitle.includes(normalizedFilterTitle)) return false;
                }

                return true;
            }).map(item => {
                // Formatting Date from "YYYYMMDD"
                const dateRaw = item.postdate || '';
                const formattedDate = dateRaw.length === 8
                    ? `${dateRaw.slice(0, 4)}.${dateRaw.slice(4, 6)}.${dateRaw.slice(6, 8)}`
                    : dateRaw;

                return {
                    title: item.title.replace(/<[^>]+>/g, ''), // Strip HTML tags
                    description: item.description.replace(/<[^>]+>/g, ''), // Strip HTML tags
                    link: item.link,
                    blogger: item.bloggername,
                    date: formattedDate
                };
            });

            return filteredAndMapped.slice(0, display);
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        return [];
    }
};
