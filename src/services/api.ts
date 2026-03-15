import axios from "axios";
import convert from "xml-js";
import { KOPISPerformance, KOPISPerformanceDetail, KOPISParams } from "@/types";

const { xml2js } = convert;

// Base URL configuration for development and production
const API_BASE_URL = process.env.NODE_ENV === "development"
  ? "/kopis/api"
  : "/kopis/proxy.php?path=";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Helper to safely extract text from XML-JSON object
const getText = (val: any) => {
  if (val === null || val === undefined) return "";
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (val._text) return val._text;
  if (val._cdata) return val._cdata;
  return "";
};

const parseXml = (xml: string) => {
  return xml2js(xml, { compact: true }) as any;
};

export const fetchPerformances = async (params: KOPISParams): Promise<KOPISPerformance[]> => {
  const apiKey = process.env.NEXT_PUBLIC_KOPIS_API_KEY;
  if (!apiKey) {
    console.error("KOPIS API Key is missing");
    return [];
  }

  const queryParams = {
    service: apiKey,
    stdate: params.startDate,
    eddate: params.endDate,
    cpage: params.page || 1,
    rows: params.rows || 20,
    prfstate: params.status,
    signgucode: params.area,
    shcate: params.genre,
    kidstate: params.kid ? "Y" : undefined,
    shprfnm: params.keyword,
    newsql: params.newsql,
  };

  try {
    const response = await apiClient.get("/pblprfr", { params: queryParams });
    const data = parseXml(response.data);

    if (data.dbs && data.dbs.db) {
      const items = Array.isArray(data.dbs.db) ? data.dbs.db : [data.dbs.db];
      return items.map((item: any) => ({
        id: getText(item.mt20id),
        title: getText(item.prfnm),
        startDate: getText(item.prfpdfrom),
        endDate: getText(item.prfpdto),
        place: getText(item.fcltynm),
        poster: getText(item.poster),
        genre: getText(item.genrenm),
        state: getText(item.prfstate),
        openrun: getText(item.openrun),
      }));
    }
    return [];
  } catch (error) {
    console.error("fetchPerformances error:", error);
    throw error;
  }
};

export const fetchPerformanceDetail = async (id: string): Promise<KOPISPerformanceDetail | null> => {
  const apiKey = process.env.NEXT_PUBLIC_KOPIS_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await apiClient.get(`/pblprfr/${id}`, {
      params: { service: apiKey },
    });
    const data = parseXml(response.data);

    if (data.dbs && data.dbs.db) {
      const item = data.dbs.db;
      return {
        id: getText(item.mt20id),
        title: getText(item.prfnm),
        startDate: getText(item.prfpdfrom),
        endDate: getText(item.prfpdto),
        place: getText(item.fcltynm),
        poster: getText(item.poster),
        genre: getText(item.genrenm),
        state: getText(item.prfstate),
        openrun: getText(item.openrun),
        cast: getText(item.prfcast),
        crew: getText(item.prfcrew),
        runtime: getText(item.prfruntime),
        age: getText(item.prfage),
        company: getText(item.entrpsnm),
        price: getText(item.pcseguidance),
        story: getText(item.sty),
        dtguidance: getText(item.dtguidance),
        images: item.styurls?.styurl 
          ? (Array.isArray(item.styurls.styurl) ? item.styurls.styurl.map((u: any) => getText(u)) : [getText(item.styurls.styurl)])
          : [],
        relates: item.relates?.relate 
          ? (Array.isArray(item.relates.relate) 
              ? item.relates.relate.map((r: any) => ({ name: getText(r.relatenm), url: getText(r.relateurl) }))
              : [{ name: getText(item.relates.relate.relatenm), url: getText(item.relates.relate.relateurl) }])
          : [],
      };
    }
    return null;
  } catch (error) {
    console.error("fetchPerformanceDetail error:", error);
    return null;
  }
};
