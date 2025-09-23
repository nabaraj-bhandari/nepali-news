import * as cheerio from "cheerio";

export const getBulletPoints = (text: string): string[] => {
  if (!text || typeof text !== "string") return [];
  return text
    .split(/\s*(?<!\d)[।.!?](?!\d)\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
};

export const cleanHtmlText = (html: string): string => {
  const $ = cheerio.load(html || "");
  $("p").last().remove();
  return $.text().trim();
};
