import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiFilm, FiTv, FiTrendingUp } from 'react-icons/fi';
import Navbar from '@/components/Navbar';

interface Movie {
    _id: string;
    title: string;
    poster: string;
    year: number;
    rating: number;
    quality: string;
}

interface TVSeries {
    _id: string;
    title: string;
    poster: string;
    year: number;
    rating: number;
    status: string;
    numberOfSeasons: number;
}

export default function Home() {
    const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
    const [recentTVSeries, setRecentTVSeries] = useState<TVSeries[]>([]);
    const [trendingContent, setTrendingContent] = useState<(Movie | TVSeries)[]>([]);

    useEffect(() => {
        fetchRecentContent();
    }, []);

    const fetchRecentContent = async () => {
        try {
            // Fetch recent movies
            const moviesRes = await fetch('/api/movies?limit=5');
            const movies = await moviesRes.json();
            setRecentMovies(movies);

            // Fetch recent TV series
            const tvSeriesRes = await fetch('/api/tv-series?limit=5');
            const tvSeries = await tvSeriesRes.json();
            setRecentTVSeries(tvSeries);

            // Combine and sort by rating for trending
            const combined = [...movies, ...tvSeries]
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 5);
            setTrendingContent(combined);
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    };

    return (
        <div className="min-h-screen bg-primary">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[70vh] flex items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
                <div className="absolute inset-0">
                    <img
                        src="/hero-bg.jpg" // Add a hero background image
                        alt="Hero Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Welcome to CinemazBD
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
                        Watch your favorite movies and TV series in high quality. New content added daily.
                    </p>
                    <div className="flex space-x-4">
                        <Link
                            href="/movies"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
                        >
                            Browse Movies
                        </Link>
                        <Link
                            href="/tv-series"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                        >
                            Browse TV Series
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Recent Movies */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <FiFilm className="w-6 h-6 text-purple-500 mr-2" />
                            <h2 className="text-2xl font-bold text-white">Recent Movies</h2>
                        </div>
                        <Link
                            href="/movies"
                            className="text-purple-500 hover:text-purple-400"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {recentMovies.map((movie) => (
                            <Link key={movie._id} href={`/movies/${movie._id}`}>
                                <div className="bg-secondary rounded-lg overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all duration-200">
                                    <div className="relative aspect-[2/3]">
                                        <img
                                            src={movie.poster}
                                            alt={movie.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                                                {movie.quality}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-white font-medium truncate">{movie.title}</h3>
                                        <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                                            <span>{movie.year}</span>
                                            <div className="flex items-center">
                                                <span className="text-yellow-400 mr-1">⭐</span>
                                                <span>{movie.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Recent TV Series */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <FiTv className="w-6 h-6 text-pink-500 mr-2" />
                            <h2 className="text-2xl font-bold text-white">Recent TV Series</h2>
                        </div>
                        <Link
                            href="/tv-series"
                            className="text-pink-500 hover:text-pink-400"
                        >
                            View All
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {recentTVSeries.map((series) => (
                            <Link key={series._id} href={`/tv-series/${series._id}`}>
                                <div className="bg-secondary rounded-lg overflow-hidden hover:ring-2 hover:ring-pink-500 transition-all duration-200">
                                    <div className="relative aspect-[2/3]">
                                        <img
                                            src={series.poster}
                                            alt={series.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded">
                                                {series.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-white font-medium truncate">{series.title}</h3>
                                        <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                                            <span>{series.year}</span>
                                            <div className="flex items-center">
                                                <span className="text-yellow-400 mr-1">⭐</span>
                                                <span>{series.rating}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <span className="text-xs text-gray-400">
                                                {series.numberOfSeasons} Seasons
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Trending Section */}
                <section>
                    <div className="flex items-center mb-6">
                        <FiTrendingUp className="w-6 h-6 text-blue-500 mr-2" />
                        <h2 className="text-2xl font-bold text-white">Trending Now</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        {trendingContent.map((content) => (
                            <Link
                                key={content._id}
                                href={`/${('numberOfSeasons' in content) ? 'tv-series' : 'movies'}/${content._id}`}
                            >
                                <div className="bg-secondary rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all duration-200">
                                    <div className="relative aspect-[2/3]">
                                        <img
                                            src={content.poster}
                                            alt={content.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-white font-medium truncate">{content.title}</h3>
                                        <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
                                            <span>{content.year}</span>
                                            <div className="flex items-center">
                                                <span className="text-yellow-400 mr-1">⭐</span>
                                                <span>{content.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="bg-secondary py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-gray-400">
                        <p>&copy; 2024 CinemazBD. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 