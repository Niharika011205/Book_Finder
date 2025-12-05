import { useState } from 'react';
import Footer from '../components/Footer';
import { API_URL } from '../config';

export default function SearchPage({ userEmail, onNotification, onStatsUpdate }) {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const searchBooks = async (searchQuery) => {
    setLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=20`
      );
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        setBooks([]);
        setLoading(false);
        return;
      }

      const formattedBooks = data.items.map(item => {
        const imageLinks = item.volumeInfo?.imageLinks;
        let thumbnail = null;

        if (imageLinks) {
          let originalUrl = imageLinks.thumbnail || imageLinks.smallThumbnail || imageLinks.medium || imageLinks.large;

          if (originalUrl && originalUrl.startsWith('http:')) {
            originalUrl = originalUrl.replace('http:', 'https:');
          }

          if (originalUrl) {
            thumbnail = `${API_URL}/proxy-image?url=${encodeURIComponent(originalUrl)}`;
          }
        }

        return {
          googleId: item.id,
          title: item.volumeInfo?.title || 'No Title',
          authors: item.volumeInfo?.authors || ['Unknown Author'],
          thumbnail: thumbnail,
          originalThumbnail: imageLinks?.thumbnail || imageLinks?.smallThumbnail,
          description: item.volumeInfo?.description || 'No description available.',
          publishedDate: item.volumeInfo?.publishedDate || '',
          pageCount: item.volumeInfo?.pageCount || 0,
        };
      });

      setBooks(formattedBooks);
    } catch (err) {
      setError('Failed to search books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      searchBooks(query);
    }
  };

  const addToLibrary = async (book) => {
    try {
      const newBook = {
        ...book,
        userEmail: userEmail.toLowerCase().trim(),
        status: 'to-read',
        favourite: false,
        notes: '',
        addedAt: new Date().toISOString()
      };
      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      });
      await response.json();
      onNotification(`"${book.title}" added to your library!`);
      if (onStatsUpdate) onStatsUpdate();
    } catch (err) {
      alert('Failed to add book to library.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-16 px-8 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 flex items-center gap-3">
            🔍 Discover Your Next Great Read
          </h1>
          <p className="text-xl text-emerald-100 mb-8">
            Search millions of books and build your personal library
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, author, ISBN, or keyword..."
                  className="w-full px-6 py-4 text-lg text-gray-800 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300 transition"
                  disabled={loading}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-white text-emerald-600 font-bold text-lg rounded-xl shadow-lg hover:bg-emerald-50 transition disabled:bg-gray-300 disabled:text-gray-500"
                disabled={loading || !query.trim()}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : 'Search'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {!hasSearched && !loading && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📚</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Your Book Discovery Journey</h2>
            <p className="text-xl text-gray-600 mb-8">Search for books by title, author, or any keyword</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Harry Potter', 'JavaScript', 'Psychology', 'Science Fiction'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                    searchBooks(suggestion);
                  }}
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-blue-50 transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="animate-spin h-16 w-16 text-blue-600 mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl text-gray-600">Searching for books...</p>
          </div>
        )}

        {books.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Found {books.length} {books.length === 1 ? 'book' : 'books'}
              </h2>
              <p className="text-gray-600">Showing results for "{query}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book, index) => (
                <div
                  key={book.googleId}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Book Cover */}
                  <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden p-4">
                    {book.thumbnail && (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                        onLoad={(e) => {
                          e.target.nextElementSibling.style.display = 'none';
                        }}
                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300 z-10"
                      />
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                      <span className="text-6xl mb-2">📚</span>
                      <span className="text-sm font-semibold text-center px-2">{book.title.substring(0, 30)}</span>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 flex items-center gap-2">
                      <span className="text-blue-500">✍️</span>
                      {book.authors.join(', ')}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      {book.publishedDate && (
                        <span className="flex items-center gap-1">
                          📅 {book.publishedDate.split('-')[0]}
                        </span>
                      )}
                      {book.pageCount > 0 && (
                        <span className="flex items-center gap-1">
                          📄 {book.pageCount} pages
                        </span>
                      )}
                    </div>

                    <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">
                      {book.description}
                    </p>

                    <button
                      onClick={() => addToLibrary(book)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <span className="text-xl">+</span>
                      Add to Library
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && books.length === 0 && hasSearched && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Books Found</h2>
            <p className="text-xl text-gray-600 mb-8">
              We couldn't find any books matching "{query}"
            </p>
            <button
              onClick={() => {
                setQuery('');
                setHasSearched(false);
                setBooks([]);
              }}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Try Another Search
            </button>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
