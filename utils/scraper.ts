import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeEkantipur() {
  try {
    const { data } = await axios.get("https://ekantipur.com/headlines", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        Connection: "keep-alive",
      },
    });
    const $ = cheerio.load(data);

    return $("article > .teaser")
      .map((_: number, article: any) => {
        const el = $(article);
        return {
          title: el.find("h2>a").text().trim(),
          author: el.find(".authdate>.author").text().trim(),
          date: el.find(".authdate>.datetime").text().trim(),
          description: el.find("p").text().trim(),
          url: el.find("h2 > a").attr("href"),
          source: "eKantipur",
        };
      })
      .get();
  } catch (err: any) {
    console.error("Scraper Error: eKantipur", err.message || err);
    throw new Error("Failed to scrape eKantipur");
  }
}
