import axios from 'axios';
import convert from 'xml-js';
const { xml2js } = convert;

// Use Vite proxy in development, PHP proxy in production (Cafe24)
const API_BASE_URL = import.meta.env.DEV
    ? '/api'  // Development: use Vite proxy
    : '/kopis/proxy.php?path=';  // Production: use PHP proxy for Cafe24

// Function to get API key from environment or storage
const getApiKey = () => {
    return import.meta.env.VITE_KOPIS_API_KEY || localStorage.getItem('kopis_api_key');
};

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Helper to parse XML response
const parseResponse = (response) => {
    try {
        const json = xml2js(response.data, { compact: true, spaces: 4 });
        return json;
    } catch (error) {
        console.error("Error parsing XML:", error);
        throw error;
    }
};

export const fetchPerformances = async (params) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("API Key is missing. Please set VITE_KOPIS_API_KEY in .env or provide it.");

    const {
        startDate, // YYYYMMDD
        endDate,   // YYYYMMDD
        page = 1,
        rows = 10,
        area,      // Area code (optional)
        genre,     // Genre code (optional)
        status,     // status code (optional)
        shcate,    // Genre code (required for some endpoints, defaulting to all)
        keyword,   // Search keyword
    } = params;

    // Default parameters
    const queryParams = {
        service: apiKey,
        stdate: startDate,
        eddate: endDate,
        cpage: page,
        rows: rows,
        prfstate: status, // e.g., 01 (plan), 02 (running)
        signgucode: area,
        shcate: genre, // e.g. AAAA
        kidstate: params.kid ? 'Y' : undefined,
        shprfnm: keyword, // Performance name search
    };

    // Remove undefined or empty params
    Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === undefined || queryParams[key] === '') {
            delete queryParams[key];
        }
    });

    try {
        const response = await apiClient.get('/pblprfr', { params: queryParams });
        const data = parseResponse(response);

        // Check if data.dbs and data.dbs.db exists (structure usually <dbs><db>...</db></dbs>)
        if (data.dbs && data.dbs.db) {
            const items = Array.isArray(data.dbs.db) ? data.dbs.db : [data.dbs.db];
            return items.map(item => ({
                id: item.mt20id?._text,
                title: item.prfnm?._text,
                startDate: item.prfpdfrom?._text,
                endDate: item.prfpdto?._text,
                place: item.fcltynm?._text,
                poster: item.poster?._text,
                genre: item.genrenm?._text,
                state: item.prfstate?._text,
                openrun: item.openrun?._text,
            }));
        } else {
            return [];
        }
    } catch (error) {
        throw error;
    }
};

export const fetchPerformanceDetail = async (id) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("API Key is missing.");

    try {
        const response = await apiClient.get(`/pblprfr/${id}`, {
            params: { service: apiKey }
        });
        const data = parseResponse(response);

        if (data.dbs && data.dbs.db) {
            const item = data.dbs.db;
            return {
                id: item.mt20id?._text,
                title: item.prfnm?._text,
                startDate: item.prfpdfrom?._text,
                endDate: item.prfpdto?._text,
                place: item.fcltynm?._text,
                cast: item.prfcast?._text,
                crew: item.prfcrew?._text,
                runtime: item.prfruntime?._text,
                age: item.prfage?._text,
                company: item.entrpsnm?._text,
                price: item.pcseguidance?._text,
                poster: item.poster?._text,
                story: item.sty?._text, // Some endpoints return story
                genre: item.genrenm?._text,
                state: item.prfstate?._text,
                openrun: item.openrun?._text,
                images: item.styurls?.styurl ?
                    (Array.isArray(item.styurls.styurl) ? item.styurls.styurl.map(url => url._text) : [item.styurls.styurl._text]) : [],
                dtguidance: item.dtguidance?._text, // Performance schedule
                relates: item.relates?.relate ? // Booking URLs 
                    (Array.isArray(item.relates.relate) ?
                        item.relates.relate.map(r => ({ name: r.relatenm?._text, url: r.relateurl?._text })) :
                        [{ name: item.relates.relate.relatenm?._text, url: item.relates.relate.relateurl?._text }]
                    ) : []
            };
        }
        return null;
    } catch (error) {
        throw error;
    }
};
