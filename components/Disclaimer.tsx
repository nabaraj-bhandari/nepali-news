export default function Disclaimer() {
  return (
    <div className="max-w-4xl mx-auto m-4">
      <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-sm rounded-lg p-3 border border-yellow-300 dark:border-yellow-700 shadow-sm">
        <p className="text-center font-bold mb-1">Disclaimer</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Hobby project for learning.</li>
          <li>No profits involved.</li>
          <li>Data may not be up to date.</li>
        </ul>
      </div>
    </div>
  );
}
