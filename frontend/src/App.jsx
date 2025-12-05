import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import LibraryPage from './pages/LibraryPage';
import FavouritesPage from './pages/FavouritesPage';
import ProfilePage from './pages/ProfilePage';
import Sidebar from './components/Sidebar';
import Notification from './components/Notification';
import { API_URL } from './config';

function App() {
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({ finished: 0, reading: 0, total: 0 });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      const normalizedEmail = user.email.toLowerCase().trim();
      const response = await fetch(`${API_URL}/books?userEmail=${encodeURIComponent(normalizedEmail)}`);
      const books = await response.json();

      const finished = books.filter(b => b.status === 'finished').length;
      const reading = books.filter(b => b.status === 'reading').length;

      setStats({
        finished,
        reading,
        total: books.length
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleLoginSuccess = (message) => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setNotification(message);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setNotification('Logged out successfully.');
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {notification && (
          <Notification
            message={notification}
            onClose={() => setNotification('')}
          />
        )}

        {user ? (
          <div className="flex h-screen">
            <Sidebar
              user={user}
              stats={stats}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              onLogout={handleLogout}
            />

            <div className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<SearchPage userEmail={user.email} onNotification={setNotification} onStatsUpdate={loadStats} />} />
                <Route path="/library" element={<LibraryPage userEmail={user.email} onNotification={setNotification} onStatsUpdate={loadStats} />} />
                <Route path="/favourites" element={<FavouritesPage userEmail={user.email} onNotification={setNotification} onStatsUpdate={loadStats} />} />
                <Route path="/profile" element={<ProfilePage userEmail={user.email} onNotification={setNotification} onProfileUpdate={handleProfileUpdate} />} />
                <Route path="/login" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
