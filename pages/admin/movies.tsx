import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FiEdit2, FiTrash2, FiPlus, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import MovieEditModal from '@/components/MovieEditModal';

interface Movie {
    _id: string;
    tmdbId: string;
    title: string;
    poster: string;
    backdrop: string | null;
    genres: string[];
    year: number;
    rating: number;
    quality: string;
    streamwishId: string;
    embedCode: string;
    overview: string;
}

const MoviesManagement: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedMovies, setExpandedMovies] = useState<{ [key: string]: boolean }>({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await fetch('/api/movies');
            const data = await res.json();
            setMovies(data);
        } catch (error) {
            console.error('Error fetching movies:', error);
            toast.error('Error fetching movies');
        }
    };

    const toggleMovieExpand = (movieId: string) => {
        setExpandedMovies(prev => ({
            ...prev,
            [movieId]: !prev[movieId]
        }));
    };

    const handleEditMovie = (movie: Movie) => {
        setSelectedMovie(movie);
        setShowEditModal(true);
    };

    const handleDeleteMovie = async (movieId: string) => {
        if (!confirm('Are you sure you want to delete this movie?')) return;

        try {
            const res = await fetch(`/api/movies/${movieId}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete movie');

            toast.success('Movie deleted successfully');
            fetchMovies();
        } catch (error) {
            console.error('Error deleting movie:', error);
            toast.error('Error deleting movie');
        }
    };

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="bg-secondary rounded-lg p-6">
                {/* Search Bar */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">Movies Management</h1>
                    <input
                        type="text"
                        placeholder="Search movies..."
                        className="bg-primary text-white px-4 py-2 rounded w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Movies List */}
                <div className="space-y-6">
                    {filteredMovies.map((movie) => (
                        <div key={movie._id} className={`bg-primary rounded-lg p-4 ${movie.embedCode ? 'border-l-4 border-green-500' : ''}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={movie.poster}
                                        alt={movie.title}
                                        className="w-16 h-24 object-cover rounded"
                                    />
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{movie.title}</h3>
                                        <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                            <span>{movie.year}</span>
                                            <span>•</span>
                                            <span>⭐ {movie.rating}</span>
                                            <span>•</span>
                                            <span>{movie.streamwishId}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {/* Edit Button */}
                                    <button
                                        onClick={() => handleEditMovie(movie)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg flex items-center space-x-2"
                                    >
                                        <FiEdit2 size={18} />
                                        <span>Edit</span>
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDeleteMovie(movie._id)}
                                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg flex items-center space-x-2"
                                    >
                                        <FiTrash2 size={18} />
                                        <span>Delete</span>
                                    </button>

                                    {/* Dropdown Toggle Button */}
                                    <button
                                        onClick={() => toggleMovieExpand(movie._id)}
                                        className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-all duration-200"
                                    >
                                        {expandedMovies[movie._id] ? (
                                            <FiChevronUp size={24} className="text-gray-300" />
                                        ) : (
                                            <FiChevronDown size={24} className="text-gray-300" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Movie Details Section */}
                            {expandedMovies[movie._id] && (
                                <div className="mt-4 bg-secondary rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-white font-medium mb-2">Overview</h4>
                                            <p className="text-gray-400 text-sm">{movie.overview}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium mb-2">Details</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Quality:</span>
                                                    <span className="text-white">{movie.quality}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">StreamWish ID:</span>
                                                    <span className="text-white">{movie.streamwishId || 'Not set'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-400">Genres:</span>
                                                    <span className="text-white">{movie.genres.join(', ')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && selectedMovie && (
                <MovieEditModal
                    movie={selectedMovie}
                    onClose={() => setShowEditModal(false)}
                    onSave={async (updates) => {
                        try {
                            const res = await fetch(`/api/movies/${selectedMovie._id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(updates),
                            });

                            if (!res.ok) throw new Error('Failed to update movie');

                            toast.success('Movie updated successfully');
                            fetchMovies();
                            setShowEditModal(false);
                        } catch (error) {
                            console.error('Error updating movie:', error);
                            toast.error('Error updating movie');
                        }
                    }}
                />
            )}
        </DashboardLayout>
    );
};

export default MoviesManagement; 