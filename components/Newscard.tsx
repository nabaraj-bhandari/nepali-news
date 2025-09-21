interface NewsProps {
  news: {
    title: string;
    author: string;
    date: string;
    description: string;
    url: string;
  };
}

export default function NewsCard({ news }: NewsProps) {
  return (
    <article className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <h2 className="text-xl font-semibold mb-2">{news.title}</h2>

      <div className="text-sm text-gray-400 mb-2">
        {news.author || news.date ? (
          <span>
            {news.author} | {news.date}
          </span>
        ) : (
          <span>No author/date</span>
        )}
      </div>

      <p className="text-gray-500 mb-3">{news.description}</p>

      <a
        href={news.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-blue-600 hover:underline text-sm"
      >
        Read more →
      </a>
    </article>
  );
}
