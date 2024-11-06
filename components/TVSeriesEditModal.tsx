import { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface TVSeriesData {
    _id: string;
    title: string;
    poster: string;
    genres: string[];
    status: string;
    quality: string;
    year: number;
    streamwishId: string;
}

interface Props {
    series: TVSeriesData;
    onClose: () => void;
    onSave: (updates: Partial<TVSeriesData>) => void;
}

export default function TVSeriesEditModal({ series, onClose, onSave }: Props) {
    const [editedSeries, setEditedSeries] = useState({
        ...series,
        quality: series.quality || 'HD',
        year: series.year || new Date().getFullYear()
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-secondary p-6 rounded-lg w-[500px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Edit TV Series</h2>
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
                            value={editedSeries.title}
                            onChange={(e) => setEditedSeries({
                                ...editedSeries,
                                title: e.target.value
                            })}
                        />
                    </div>

                    <div>
                        <label className="text-white text-sm">Year</label>
                        <input
                            type="number"
                            className="w-full bg-primary text-white p-2 rounded"
                            value={editedSeries.year}
                            onChange={(e) => setEditedSeries({
                                ...editedSeries,
                                year: parseInt(e.target.value)
                            })}
                        />
                    </div>

                    <div>
                        <label className="text-white text-sm">Poster URL</label>
                        <input
                            type="text"
                            className="w-full bg-primary text-white p-2 rounded"
                            value={editedSeries.poster}
                            onChange={(e) => setEditedSeries({
                                ...editedSeries,
                                poster: e.target.value
                            })}
                        />
                    </div>

                    <div>
                        <label className="text-white text-sm">Genres (comma separated)</label>
                        <input
                            type="text"
                            className="w-full bg-primary text-white p-2 rounded"
                            value={editedSeries.genres.join(', ')}
                            onChange={(e) => setEditedSeries({
                                ...editedSeries,
                                genres: e.target.value.split(',').map(g => g.trim()).filter(Boolean)
                            })}
                        />
                    </div>

                    <div>
                        <label className="text-white text-sm">Status</label>
                        <select
                            className="w-full bg-primary text-white p-2 rounded"
                            value={editedSeries.status}
                            onChange={(e) => setEditedSeries({
                                ...editedSeries,
                                status: e.target.value
                            })}
                        >
                            <option value="Returning Series">Ongoing</option>
                            <option value="Ended">Ended</option>
                            <option value="Canceled">Canceled</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-white text-sm">Quality</label>
                        <select
                            className="w-full bg-primary text-white p-2 rounded"
                            value={editedSeries.quality}
                            onChange={(e) => setEditedSeries({
                                ...editedSeries,
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

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave(editedSeries)}
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