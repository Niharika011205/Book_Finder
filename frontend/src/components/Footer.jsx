export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="font-bold text-gray-800">Book Finder</span>
          </div>
          <p className="text-gray-600 text-sm">
            Powered by Google Books API • Built with React & Tailwind CSS
          </p>
          <p className="text-gray-500 text-sm">
            © 2025 Book Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
