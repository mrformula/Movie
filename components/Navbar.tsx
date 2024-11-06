import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiMenu, FiX, FiHome, FiFilm, FiTv, FiLogIn } from 'react-icons/fi';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        // Check login status
        const checkLoginStatus = () => {
            const loginStatus = sessionStorage.getItem('isLoggedIn');
            setIsLoggedIn(!!loginStatus);
        };

        checkLoginStatus();
        window.addEventListener('storage', checkLoginStatus);
        return () => window.removeEventListener('storage', checkLoginStatus);
    }, []);

    const handleLoginClick = () => {
        if (isLoggedIn) {
            router.push('/admin');
        } else {
            router.push('/login');
        }
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-secondary shadow-lg' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold text-purple-500">CinemazBD</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className={`text-gray-300 hover:text-white transition-colors ${router.pathname === '/' ? 'text-purple-500' : ''
                                }`}
                        >
                            <span className="flex items-center">
                                <FiHome className="mr-2" /> Home
                            </span>
                        </Link>
                        <Link
                            href="/movies"
                            className={`text-gray-300 hover:text-white transition-colors ${router.pathname === '/movies' ? 'text-purple-500' : ''
                                }`}
                        >
                            <span className="flex items-center">
                                <FiFilm className="mr-2" /> Movies
                            </span>
                        </Link>
                        <Link
                            href="/tv-series"
                            className={`text-gray-300 hover:text-white transition-colors ${router.pathname === '/tv-series' ? 'text-purple-500' : ''
                                }`}
                        >
                            <span className="flex items-center">
                                <FiTv className="mr-2" /> TV Series
                            </span>
                        </Link>
                        <button
                            onClick={handleLoginClick}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
                        >
                            <FiLogIn className="mr-2" />
                            {isLoggedIn ? 'Dashboard' : 'Login'}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white"
                        >
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link
                                href="/"
                                className={`block px-3 py-2 rounded-md text-base font-medium ${router.pathname === '/'
                                    ? 'text-purple-500 bg-purple-600 bg-opacity-20'
                                    : 'text-gray-300 hover:text-white hover:bg-purple-600 hover:bg-opacity-10'
                                    }`}
                            >
                                <span className="flex items-center">
                                    <FiHome className="mr-2" /> Home
                                </span>
                            </Link>
                            <Link
                                href="/movies"
                                className={`block px-3 py-2 rounded-md text-base font-medium ${router.pathname === '/movies'
                                    ? 'text-purple-500 bg-purple-600 bg-opacity-20'
                                    : 'text-gray-300 hover:text-white hover:bg-purple-600 hover:bg-opacity-10'
                                    }`}
                            >
                                <span className="flex items-center">
                                    <FiFilm className="mr-2" /> Movies
                                </span>
                            </Link>
                            <Link
                                href="/tv-series"
                                className={`block px-3 py-2 rounded-md text-base font-medium ${router.pathname === '/tv-series'
                                    ? 'text-purple-500 bg-purple-600 bg-opacity-20'
                                    : 'text-gray-300 hover:text-white hover:bg-purple-600 hover:bg-opacity-10'
                                    }`}
                            >
                                <span className="flex items-center">
                                    <FiTv className="mr-2" /> TV Series
                                </span>
                            </Link>
                            <button
                                onClick={handleLoginClick}
                                className="block px-3 py-2 rounded-md text-base font-medium bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                <span className="flex items-center">
                                    <FiLogIn className="mr-2" />
                                    {isLoggedIn ? 'Dashboard' : 'Login'}
                                </span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
} 