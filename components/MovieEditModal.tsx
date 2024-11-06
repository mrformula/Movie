import { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface MovieData {
    _id: string;
    title: string;
    poster: string;
    genres: string[];
    year: number;
    quality: string;
    embedCode: string;
    streamwishId: string;
}

interface Props {
    movie: MovieData;
    onClose: () => void;
    onSave: (updates: Partial<MovieData>) => void;
}

export default function MovieEditModal({ movie, onClose, onSave }: Props) {
    const [editedMovie, setEditedMovie] = useState({
        ...movie,
        embedCode: movie.embedCode || '',
        streamwishId: movie.streamwishId || '',
        year: movie.year || new Date().getFullYear(),
        quality: movie.quality || 'HD'
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-secondary p-6 rounded-lg w-[500px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Edit Movie</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FiX size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-white text-sm">Title</label>
                        <input
                            type="text"
                            className="w-full bg-primary text-white p-2 rounded"
                            value={editedMovie.title}
                            onChange={(e) => setEditedMovie({
                                ...editedMovie,
                                title: e.target.value
                            })}
                        />
                    </div>

                    <div>
                        <label className="text-white text-sm">Year</label>
                        <input
                            type="number"
                            className="w-full bg-primary text-white p-2 rounded"
                            value={editedMovie.year}
                            onChange={(e) => setEditedMovie({
                                ...editedMovie,
                                year: parseInt(e.target.value)
                            })}
                        />
                    </div>

                    <div>
                        <label className="text-white text-sm">Poster URL</label>
                        <input
                            type="text"
                            className="w-full bg-primary text-white p-2 rounded"
                            value={editedMovie.poster}
                            onChange={(e) => setEditedMovie({
                                ...editedMovie,
                                poster: e.target.value
                            })}
                        />
                    </div>

                    <div>
                        <label className="text-white text-sm">Genres (comma separated)</label>
                        <input
                            type="text"
                            className="w-full bg-primary text-white p-2 rounded"
                            value={editedMovie.genres.join(', ')}
                            onChange={(e) => setEditedMovie({
                                ...editedMovie,
                                genres: e.target.value.split(',').map(g => g.trim()).filter(Boolean)
                            })}
                        />
                    </div>

                    <div>
                        <label className="text-white text-sm">Quality</label>
                        <select
                            className="w-full bg-primary text-white p-2 rounded"
                            value={editedMovie.quality}
                            onChange={(e) => setEditedMovie({
                                ...editedMovie,
                                quality: e.target.value
                            })}
                        >
                            <option value="CAM">CAM</option>
                            <option value="HDCAM">HDCAM</option>
                            <option value="HD">HD</option>
                            <option value="WebRip">WebRip</option>
                            <option value="WebDL">WebDL</option>
                            <option value="HDTS">HDTS</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-white text-sm">Embed Code</label>
                        <textarea
                            className="w-full bg-primary text-white p-2 rounded"
                            rows={3}
                            value={editedMovie.embedCode}
                            onChange={(e) => setEditedMovie({
                                ...editedMovie,
                                embedCode: e.target.value
                            })}
                            placeholder="Enter embed code (e.g., https://hlswish.com/vqqekkxcxrmt)"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave(editedMovie)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 