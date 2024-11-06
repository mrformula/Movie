import { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface Props {
    episode: {
        episodeNumber: number;
        title: string;
        embedCode: string;
        streamwishId: string;
    };
    onClose: () => void;
    onSave: (updates: any) => void;
}

export default function EpisodeEditModal({ episode, onClose, onSave }: Props) {
    const [editedEpisode, setEditedEpisode] = useState({
        ...episode,
        embedCode: episode.embedCode || '',
        streamwishId: episode.streamwishId || ''
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-secondary p-6 rounded-lg w-[500px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">
                        Add Link - Episode {episode.episodeNumber}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FiX size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-white text-sm">StreamWish ID</label>
                        <input
                            type="text"
                            className="w-full bg-primary text-white p-2 rounded"
                            value={editedEpisode.streamwishId}
                            onChange={(e) => setEditedEpisode({
                                ...editedEpisode,
                                streamwishId: e.target.value
                            })}
                            placeholder="Enter StreamWish ID"
                        />
                    </div>

                    <div>
                        <label className="text-white text-sm">Embed Code</label>
                        <textarea
                            className="w-full bg-primary text-white p-2 rounded"
                            rows={3}
                            value={editedEpisode.embedCode}
                            onChange={(e) => setEditedEpisode({
                                ...editedEpisode,
                                embedCode: e.target.value
                            })}
                            placeholder="Enter embed code"
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
                            onClick={() => onSave(editedEpisode)}
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