import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import { FiPlay, FiStar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import AdBlocker from '@/components/AdBlocker';

interface Episode {
    episodeNumber: number;
    title: string;
    overview: string;
    airDate: string;
    stillPath: string | null;
    embedCode: string;
}

interface Season {
    seasonNumber: number;
    episodes: Episode[];
}

interface TVSeries {
    _id: string;
    title: string;
    poster: string;
    backdrop: string;
    genres: string[];
    year: number;
    rating: number;
    status: string;
    quality: string;
    overview: string;
    numberOfSeasons: number;
    networks: string[];
    autoSeasons: Season[];
    manualSeasons: Season[];
    viewMode: 'auto' | 'manual';
}

export default function TVSeriesDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [series, setSeries] = useState<TVSeries | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedSeasons, setExpandedSeasons] = useState<{ [key: number]: boolean }>({});
    const [selectedEpisode, setSelectedEpisode] = useState<{
        seasonNumber: number;
        episode: Episode;
    } | null>(null);
    const [adBlockEnabled, setAdBlockEnabled] = useState(true);

    useEffect(() => {
        if (id) {
            fetchTVSeriesDetails();
        }
    }, [id]);

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

    const fetchTVSeriesDetails = async () => {
        try {
            const res = await fetch(`/api/tv-series/${id}`);
            if (!res.ok) throw new Error('TV series not found');
            const data = await res.json();
            setSeries(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching TV series details:', error);
            setLoading(false);
        }
    };

    const toggleSeason = (seasonNumber: number) => {
        setExpandedSeasons(prev => ({
            ...prev,
            [seasonNumber]: !prev[seasonNumber]
        }));
    };

    const getEmbedUrl = (code: string) => {
        const videoId = code.replace('https://hlswish.com/', '')
            .replace('https://hlswish.com/e/', '')
            .replace('https://embedwish.com/e/', '')
            .replace('https://embedwish.com/', '')
            .replace('/e/', '')
            .replace('e/', '');

        return `https://embedwish.com/e/${videoId}`;
    };

    const scrollToPlayer = () => {
        const playerSection = document.getElementById('player-section');
        if (playerSection) {
            setExpandedSeasons({});

            setTimeout(() => {
                playerSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 50);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!series) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <div className="text-white">TV series not found</div>
            </div>
        );
    }

    const seasons = series.viewMode === 'auto' ? series.autoSeasons : series.manualSeasons;

    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <AdBlocker enabled={adBlockEnabled} />

            {/* Hero Section with Backdrop */}
            <div className="relative min-h-[70vh] w-full">
                {/* Backdrop Image */}
                <div className="absolute inset-0">
                    <img
                        src={series.backdrop}
                        alt={series.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-transparent" />
                </div>

                {/* Content Container */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                            {/* Poster */}
                            <div className="w-48 md:w-64 shrink-0 relative z-10 -mb-20 md:-mb-32 mx-auto md:mx-0">
                                <img
                                    src={series.poster}
                                    alt={series.title}
                                    className="w-full rounded-lg shadow-2xl"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 pb-4 md:pb-0 relative z-10">
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center md:text-left">
                                    {series.title}
                                </h1>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 mb-4">
                                    <div className="flex items-center text-yellow-400">
                                        <FiStar className="mr-1" />
                                        <span>{series.rating}/10</span>
                                    </div>
                                    <span className="text-gray-400">{series.year}</span>
                                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                                        {series.quality}
                                    </span>
                                    <span className={`${series.status === 'Ended' ? 'bg-red-600' : 'bg-green-600'} text-white px-3 py-1 rounded-full text-sm`}>
                                        {series.status}
                                    </span>
                                </div>

                                {series.genres && series.genres.length > 0 && (
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                                        {series.genres.map((genre, index) => (
                                            <span
                                                key={index}
                                                className="bg-secondary text-gray-300 px-3 py-1 rounded-full text-sm"
                                            >
                                                {genre}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {series.overview && (
                                    <p className="text-gray-300 leading-relaxed mb-4 text-sm md:text-base line-clamp-3 md:line-clamp-none text-center md:text-left">
                                        {series.overview}
                                    </p>
                                )}

                                <div className="text-gray-400 text-sm md:text-base text-center md:text-left">
                                    <div className="mb-2">
                                        <span className="font-medium text-white">Networks:</span>{' '}
                                        {series.networks.join(', ')}
                                    </div>
                                    <div>
                                        <span className="font-medium text-white">Seasons:</span>{' '}
                                        {series.numberOfSeasons}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add spacing to account for overlapping poster */}
            <div className="h-24 md:h-32 bg-gradient-to-b from-primary to-primary"></div>

            {/* Seasons and Episodes Section */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="bg-secondary rounded-lg p-4 md:p-6">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Seasons & Episodes</h2>

                    <div className="space-y-4">
                        {seasons.map((season) => (
                            <div key={season.seasonNumber} className="bg-primary rounded-lg overflow-hidden">
                                {/* Season Header */}
                                <div
                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-opacity-80"
                                    onClick={() => toggleSeason(season.seasonNumber)}
                                >
                                    <h3 className="text-lg font-medium text-white">
                                        Season {season.seasonNumber}
                                    </h3>
                                    {expandedSeasons[season.seasonNumber] ? (
                                        <FiChevronUp className="text-gray-400" />
                                    ) : (
                                        <FiChevronDown className="text-gray-400" />
                                    )}
                                </div>

                                {/* Episodes List */}
                                {expandedSeasons[season.seasonNumber] && (
                                    <div className="border-t border-gray-700">
                                        {season.episodes.map((episode) => (
                                            <div
                                                key={episode.episodeNumber}
                                                className={`p-4 border-b border-gray-700 last:border-b-0 hover:bg-secondary transition-colors`}
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h4 className="text-white font-medium mb-1">
                                                            {episode.episodeNumber}. {episode.title}
                                                        </h4>
                                                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                                                            {episode.overview}
                                                        </p>
                                                        <div className="text-gray-500 text-sm">
                                                            Air Date: {episode.airDate}
                                                        </div>
                                                    </div>
                                                    {episode.embedCode && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedEpisode({
                                                                    seasonNumber: season.seasonNumber,
                                                                    episode
                                                                });
                                                                scrollToPlayer();
                                                            }}
                                                            className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                                                        >
                                                            <FiPlay className="mr-2" />
                                                            Watch
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Video Player Section */}
                {selectedEpisode && (
                    <div id="player-section" className="mt-8">
                        <div className="bg-secondary rounded-lg p-4 md:p-6">
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
                                {series.title} - Season {selectedEpisode.seasonNumber} Episode {selectedEpisode.episode.episodeNumber}
                            </h2>
                            <div className="aspect-video bg-black rounded-lg overflow-hidden">
                                <iframe
                                    src={getEmbedUrl(selectedEpisode.episode.embedCode)}
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
            </div>
        </div>
    );
} 