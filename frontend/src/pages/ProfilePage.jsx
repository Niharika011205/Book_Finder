import { useState, useEffect } from 'react';
import { API_URL } from '../config';

function ProfilePage({ userEmail, onNotification, onProfileUpdate }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        loadUserProfile();
    }, [userEmail]);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            const normalizedEmail = userEmail.toLowerCase().trim();
            const response = await fetch(`${API_URL}/users?email=${encodeURIComponent(normalizedEmail)}`);
            const users = await response.json();

            if (users.length > 0) {
                const userData = users[0];
                setUser(userData);
                setFormData({
                    name: userData.name,
                    email: userData.email,
                    password: ''
                });
            }
        } catch (err) {
            onNotification('Error loading profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            onNotification('Name cannot be empty.');
            return;
        }

        if (!formData.email.trim() || !formData.email.includes('@')) {
            onNotification('Please enter a valid email.');
            return;
        }

        if (formData.password && formData.password !== confirmPassword) {
            onNotification('Passwords do not match.');
            return;
        }

        try {
            const updateData = {
                name: formData.name.trim(),
                email: formData.email.toLowerCase().trim()
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            await fetch(`${API_URL}/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });

            const updatedUser = { ...user, ...updateData };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setEditing(false);
            setFormData({ ...formData, password: '' });
            setConfirmPassword('');
            onNotification('Profile updated successfully.');
            onProfileUpdate(updatedUser);
        } catch (err) {
            onNotification('Error updating profile.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl text-gray-600">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-600">Manage your account information</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            {editing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Your name"
                                />
                            ) : (
                                <p className="text-gray-900 text-lg">{user.name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            {editing ? (
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="your.email@example.com"
                                />
                            ) : (
                                <p className="text-gray-900 text-lg">{user.email}</p>
                            )}
                        </div>

                        {editing && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password (leave blank to keep current)
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter new password"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                            <p className="text-gray-900">
                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        {editing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => {
                                        setEditing(false);
                                        setFormData({
                                            name: user.name,
                                            email: user.email,
                                            password: ''
                                        });
                                        setConfirmPassword('');
                                    }}
                                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setEditing(true)}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
