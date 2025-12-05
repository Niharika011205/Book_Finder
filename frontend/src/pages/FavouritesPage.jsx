import { useState, useEffect } from 'react';
import { API_URL } from '../config';

function FavouritesPage({ userEmail, onNotification, onStatsUpdate }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', notes: '' });

  useEffect(() => {
    loadFavouriteBooks();
  }, [userEmail]);

  const loadFavouriteBooks = async () => {
    try {
      setLoading(true);
      const normalizedEmail = userEmail.toLowerCase().trim();
      const response = await fetch(`${API_URL}/books?userEmail=${encodeURIComponent(normalizedEmail)}&favourite=true`);
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      onNotification('Error loading favourite books.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavourite = async (bookId) => {
    try {
      const book = books.find(b => b.id === bookId);
      await fetch(`${API_URL}/books/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favourite: false })
      });
      
      setBooks(books.filter(b => b.id !== bookId));
      onNotification(`"${book.title}" removed from favourites.`);
      onStatsUpdate();
    } catch (err) {
      onNotification('Error removing from favourites.');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book.id);
    setEditForm({ status: book.status, notes: book.notes || '' });
  };

  const handleSaveEdit = async (bookId) => {
    try {
      await fetch(`${API_URL}/books/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      setBooks(books.map(b => b.id === bookId ? { ...b, ...editForm } : b));
      setEditingBook(null);
      onNotification('Book updated successfully.');
      onStatsUpdate();
    } catch (err) {
      onNotification('Error updating book.');
    }
  };

  const handleDelete = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const book = books.find(b => b.id === bookId);
      await fetch(`${API_URL}/books/${bookId}`, { method: 'DELETE' });
      setBooks(books.filter(b => b.id !== bookId));
      onNotification(`"${book.title}" deleted from library.`);
      onStatsUpdate();
    } catch (err) {
      onNotification('Error deleting book.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading favourite books...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favourites</h1>
          <p className="text-gray-600">Your favourite books collection ({books.length} books)</p>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No favourite books yet</h3>
            <p className="text-gray-600">Mark books as favourites from your library to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map(book => (
              <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex p-4">
                  <img
                    src={book.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover'}
                    alt={book.title}
                    className="w-24 h-36 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{book.authors?.join(', ')}</p>
                    
                    {editingBook === book.id ? (
                      <div className="space-y-2">
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          className="w-full px-2 py-1 text-sm border rounded"
                        >
                          <option value="to-read">To Read</option>
                          <option value="reading">Reading</option>
                          <option value="finished">Finished</option>
                        </select>
                        <textarea
                          value={editForm.notes}
                          onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                          placeholder="Notes..."
                          className="w-full px-2 py-1 text-sm border rounded"
                          rows="2"
                        />
                      </div>
                    ) : (
                      <>
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          book.status === 'finished' ? 'bg-green-100 text-green-800' :
                          book.status === 'reading' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {book.status === 'to-read' ? 'To Read' : book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                        </span>
                        {book.notes && (
                          <p className="text-xs text-gray-600 mt-2 line-clamp-2">{book.notes}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-4 flex gap-2">
                  {editingBook === book.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(book.id)}
                        className="flex-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingBook(null)}
                        className="flex-1 px-3 py-1.5 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(book)}
                        className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveFavourite(book.id)}
                        className="flex-1 px-3 py-1.5 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                      >
                        Unfavourite
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavouritesPage;
