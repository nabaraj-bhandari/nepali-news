import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeEkantipur() {
  try {
    const { data } = await axios.get("https://ekantipur.com/headlines");
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
        };
      })
      .get();
  } catch (err: any) {
    console.error("Scraper Error: Ekantipur", err.message || err);
    throw new Error("Failed to scrape Ekantipur");
  }
}
