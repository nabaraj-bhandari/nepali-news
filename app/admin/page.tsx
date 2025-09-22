"use client";

import { useState } from "react";
import { News } from "@/types/types";

export default function AdminPage() {
  const [status, setStatus] = useState("");
  const fetchEkantipur = async () => {
    setStatus("Fetching...");

    try {
      const res = await fetch("https://ekantipur.com/headlines");
      const html = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const articles = Array.from(
        doc.querySelectorAll("article > .teaser"),
      ).slice(0, 5);

      const news: News[] = articles.map((article: any) => {
        const titleEl = article.querySelector("h2 > a");
        const dateEl = article.querySelector(".authdate > .datetime");
        const descEl = article.querySelector("p");

        return {
          title: titleEl?.textContent?.trim() || "No title",
          date: dateEl?.textContent?.trim() || "",
          description: descEl?.textContent?.trim() || "",
          url: titleEl?.getAttribute("href") || "#",
          source: "eKantipur",
        };
      });

      console.log(news);
      setStatus("News saved successfully!");
      console.log(status);
    } catch (err) {
      console.error(err);
      setStatus("Error fetching news");
    }
  };
  return (
    <div>
      <button
        onClick={fetchEkantipur}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Fetch eKantipur News
      </button>
      <p>{status}</p>
    </div>
  );
}
