import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiLock, FiUser } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function Login() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    useEffect(() => {
        // Check if already logged in
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn) {
            router.push('/admin');
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        // Hard-coded credentials
        const validCredentials = [
            { username: 'admin', password: 'admin123' },
            { username: 'user', password: 'user123' }
        ];

        const isValid = validCredentials.some(
            cred => cred.username === credentials.username && cred.password === credentials.password
        );

        if (isValid) {
            // Set session
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('user', credentials.username);

            // Trigger storage event for Navbar
            window.dispatchEvent(new Event('storage'));

            toast.success('Login successful');
            router.push('/admin');
        } else {
            toast.error('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center">
            <div className="bg-secondary p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Please sign in to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="text-gray-300 text-sm font-medium mb-1 block">
                            Username
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-primary text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter your username"
                                value={credentials.username}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    username: e.target.value
                                })}
                            />
                            <FiUser className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-300 text-sm font-medium mb-1 block">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                className="w-full bg-primary text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter your password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    password: e.target.value
                                })}
                            />
                            <FiLock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition duration-200"
                    >
                        Sign In
                    </button>

                    <div className="text-center text-gray-400 text-sm">
                        <p>Demo Credentials:</p>
                        <p>Username: admin, Password: admin123</p>
                        <p>Username: user, Password: user123</p>
                    </div>
                </form>
            </div>
        </div>
    );
} 