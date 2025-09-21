import NewsCard from "@/components/Newscard";

export default async function HomePage() {
  // Fetch data from your API route
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/fetchNews`, {
    cache: "no-store", // ensures fresh data on every load
  });

  if (!res.ok) {
    return (
      <div className="text-center mt-10 text-red-500">Failed to load news.</div>
    );
  }

  const news = await res.json();

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        हाम्रो नेपाली न्युज
      </h1>

      {news.length === 0 ? (
        <div className="text-center text-gray-600">No news available.</div>
      ) : (
        <div className="space-y-4">
          {news.map((item: any, index: number) => (
            <NewsCard key={index} news={item} />
          ))}
        </div>
      )}
    </main>
  );
}
