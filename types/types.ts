export interface News {
  title: string;
  url: string;
  source: string;
}

export type WebScraperConfig = {
  type: "rss" | "web";
  name: string;
  url: string;
  baseUrl?: string;
  listSelector?: string;
  titleSelector?: string;
  linkSelector?: string;
};
