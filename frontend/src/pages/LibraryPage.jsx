import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { API_URL } from '../config';

export default function LibraryPage({ userEmail, onNotification, onStatsUpdate }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    loadLibrary();
  }, [userEmail]);

  const loadLibrary = async () => {
    try {
      const response = await fetch(`${API_URL}/books?userEmail=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error('Error loading library:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id, updates) => {
    try {
      await fetch(`${API_URL}/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      await loadLibrary();
      setEditingId(null);
      if (updates.favourite !== undefined) {
        onNotification(updates.favourite ? 'Added to favourites! ⭐' : 'Removed from favourites');
      } else {
        onNotification('Book updated successfully!');
      }
      if (onStatsUpdate) onStatsUpdate();
    } catch (err) {
      alert('Failed to update book.');
    }
  };

  const deleteBook = async (id, title) => {
    if (confirm('Remove this book from your library?')) {
      try {
        await fetch(`${API_URL}/books/${id}`, { method: 'DELETE' });
        await loadLibrary();
        onNotification(`"${title}" removed from library`);
        if (onStatsUpdate) onStatsUpdate();
      } catch (err) {
        alert('Failed to delete book.');
      }
    }
  };

  const startEdit = (book) => {
    setEditingId(book.id);
    setEditStatus(book.status);
    setEditNotes(book.notes || '');
  };

  const saveEdit = (id) => {
    updateBook(id, { status: editStatus, notes: editNotes });
  };

  if (loading) return <div className="p-8"><p>Loading library...</p></div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 My Library</h1>
      <p className="text-gray-600 mb-8">{books.length} {books.length === 1 ? 'book' : 'books'} in your library</p>

      {books.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-8xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your library is empty</h2>
          <p className="text-gray-600">Start adding books from the Search page!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map(book => (
            <div key={book.id} className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition ${book.favourite ? 'ring-2 ring-yellow-400' : ''}`}>
              <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                  className="max-h-full max-w-full object-contain z-10"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                  <span className="text-6xl mb-2">📚</span>
                  <span className="text-sm font-semibold text-center px-2">{book.title.substring(0, 30)}</span>
                </div>
                {book.favourite && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-white p-2 rounded-full text-xl shadow-lg z-20">⭐</div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{book.authors.join(', ')}</p>

                {editingId === book.id ? (
                  <div className="space-y-3">
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="to-read">To Read</option>
                      <option value="reading">Reading</option>
                      <option value="finished">Finished</option>
                    </select>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add notes..."
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                      rows="3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(book.id)} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition">
                        Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg transition">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${
                      book.status === 'to-read' ? 'bg-blue-100 text-blue-700' :
                      book.status === 'reading' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {book.status === 'to-read' && '📖 To Read'}
                      {book.status === 'reading' && '📚 Reading'}
                      {book.status === 'finished' && '✅ Finished'}
                    </div>
                    {book.notes && <p className="text-sm italic text-gray-600 mb-3">"{book.notes}"</p>}

                    <div className="flex gap-2">
                      <button onClick={() => startEdit(book)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition text-sm">
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => updateBook(book.id, { favourite: !book.favourite })}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition text-sm"
                      >
                        {book.favourite ? '💔' : '❤️'}
                      </button>
                      <button onClick={() => deleteBook(book.id, book.title)} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition text-sm">
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
}
