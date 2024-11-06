import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { FiPlay, FiClock, FiStar, FiDownload } from 'react-icons/fi';
import VideoPlayer from '@/components/VideoPlayer';
import AdBlocker from '@/components/AdBlocker';

interface Movie {
    _id: string;
    title: string;
    poster: string;
    backdrop: string;
    genres: string[];
    year: number;
    rating: number;
    quality: string;
    overview: string;
    runtime: number;
    embedCode: string;
}

export default function MovieDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [showPlayer, setShowPlayer] = useState(false);
    const [directLink, setDirectLink] = useState<string | null>(null);
    const [adBlockEnabled, setAdBlockEnabled] = useState(true);

    useEffect(() => {
        if (id) {
            fetchMovieDetails();
        }
    }, [id]);

    const fetchMovieDetails = async () => {
        try {
            const res = await fetch(`/api/movies/${id}`);
            if (!res.ok) throw new Error('Movie not found');
            const data = await res.json();
            setMovie(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movie details:', error);
            setLoading(false);
        }
    };

    const getVideoUrl = (embedCode: string) => {
        // Remove any URL parts and get just the ID
        const videoId = embedCode.replace('https://hlswish.com/', '')
            .replace('https://hlswish.com/e/', '')
            .replace('https://embedwish.com/e/', '')
            .replace('https://embedwish.com/', '')
            .replace('/e/', '')
            .replace('e/', '');

        // Return the correct embed URL
        return `https://embedwish.com/e/${videoId}`;
    };

    const getEmbedUrl = (code: string) => {
        const videoId = code.replace('https://hlswish.com/', '')
            .replace('https://hlswish.com/e/', '')
            .replace('https://embedwish.com/e/', '')
            .replace('https://embedwish.com/', '')
            .replace('/e/', '')
            .replace('e/', '');

        return `https://hlswish.com/e/${videoId}`;
    };

    const getDirectLink = async (embedCode: string) => {
        try {
            const videoId = embedCode.replace('https://hlswish.com/', '')
                .replace('https://hlswish.com/e/', '')
                .replace('https://embedwish.com/e/', '')
                .replace('https://embedwish.com/', '')
                .replace('/e/', '')
                .replace('e/', '');

            const res = await fetch(`/api/stream/direct-link?fileCode=${videoId}`);
            const data = await res.json();

            // Get highest quality version
            const highestQuality = data.versions.find((v: any) => v.name === 'o') ||
                data.versions[0];

            if (highestQuality) {
                setDirectLink(highestQuality.url);
            }
        } catch (error) {
            console.error('Error getting direct link:', error);
        }
    };

    useEffect(() => {
        if (movie?.embedCode) {
            getDirectLink(movie.embedCode);
        }
    }, [movie]);

    const scrollToPlayer = () => {
        const playerSection = document.getElementById('player-section');
        if (playerSection) {
            playerSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        // Fetch ad block settings
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                setAdBlockEnabled(data.adBlockEnabled);
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="text-white">Movie not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <AdBlocker enabled={adBlockEnabled} />

            <div className="container mx-auto px-4 pt-24 pb-12">
                {/* Movie Details Section */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Poster */}
                    <div className="w-full md:w-1/3 lg:w-1/4">
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-full rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>

                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="flex items-center text-yellow-400">
                                <FiStar className="mr-1" />
                                <span>{movie.rating}/10</span>
                            </div>
                            <span className="text-gray-400">{movie.year}</span>
                            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                                {movie.quality}
                            </span>
                        </div>

                        {movie.genres && movie.genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {movie.genres.map((genre, index) => (
                                    <span
                                        key={index}
                                        className="bg-secondary text-gray-300 px-3 py-1 rounded-full text-sm"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        )}

                        {movie.overview && (
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold mb-4 text-white">Overview</h2>
                                <p className="text-gray-300 leading-relaxed mb-6">
                                    {movie.overview}
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    {movie.embedCode && (
                                        <button
                                            onClick={scrollToPlayer}
                                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg flex items-center text-lg font-medium transition-colors duration-200"
                                        >
                                            <FiPlay className="mr-2" />
                                            Watch Now
                                        </button>
                                    )}

                                    {directLink && (
                                        <a
                                            href={directLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg flex items-center text-lg font-medium transition-colors duration-200"
                                        >
                                            <FiDownload className="mr-2" />
                                            Download
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Video Player Section */}
                {movie.embedCode && (
                    <div id="player-section" className="mt-12">
                        <div className="bg-secondary rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-white mb-6">Watch {movie.title}</h2>
                            <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                <iframe
                                    src={getVideoUrl(movie.embedCode)}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    scrolling="no"
                                    allowFullScreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    style={{ width: '100%', height: '100%' }}
                                ></iframe>
                            </div>
                        </div>
                    </div>
                )}

                {/* Download Button (Alternative Position) */}
                {directLink && (
                    <div className="mt-4">
                        <a
                            href={directLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg flex items-center text-lg font-medium transition-colors duration-200 w-fit"
                        >
                            <FiDownload className="mr-2" />
                            Download Movie
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
} 