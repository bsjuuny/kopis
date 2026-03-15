export interface KOPISPerformance {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  place: string;
  poster: string;
  genre: string;
  state: string;
  openrun?: string;
}

export interface KOPISPerformanceDetail extends KOPISPerformance {
  cast?: string;
  crew?: string;
  runtime?: string;
  age?: string;
  company?: string;
  price?: string;
  story?: string;
  dtguidance?: string;
  images: string[];
  relates: { name: string; url: string }[];
}

export interface KOPISParams {
  startDate?: string;
  endDate?: string;
  page?: string | number;
  rows?: string | number;
  area?: string;
  genre?: string;
  status?: string;
  keyword?: string;
  kid?: boolean;
  newsql?: string;
}
