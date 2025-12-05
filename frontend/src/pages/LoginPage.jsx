import { useState } from 'react';

export default function LoginPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const normalizedEmail = email.toLowerCase().trim();

    try {
      const response = await fetch(`http://localhost:5000/users?email=${encodeURIComponent(normalizedEmail)}`);
      const users = await response.json();

      if (isLogin) {
        if (users.length === 0) {
          setError('Email not found. Please sign up first.');
          setLoading(false);
          return;
        }

        const dbUser = users[0];
        const user = { name: dbUser.name, email: dbUser.email };
        localStorage.setItem('user', JSON.stringify(user));
        onLoginSuccess('Login successful! Welcome back.');
      } else {
        if (users.length > 0) {
          setError('Email already registered. Please login instead.');
          setLoading(false);
          return;
        }

        const newUser = {
          name: name || email.split('@')[0],
          email: normalizedEmail,
          password: password,
          createdAt: new Date().toISOString()
        };

        const createResponse = await fetch('http://localhost:5000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });

        const savedUser = await createResponse.json();
        const user = { name: savedUser.name, email: savedUser.email };
        localStorage.setItem('user', JSON.stringify(user));
        onLoginSuccess('Registration successful! Welcome to Book Finder.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 relative bg-slate-800">
        <img
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80"
          alt="Library"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">📚 Book Finder</h1>
          <p className="text-xl drop-shadow-md">Discover, organize, and manage your personal library</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600 mb-8">
            {isLogin ? 'Login to access your library' : 'Sign up to get started'}
          </p>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
              <p className="font-semibold">⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength="6"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-blue-500 font-semibold cursor-pointer hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
