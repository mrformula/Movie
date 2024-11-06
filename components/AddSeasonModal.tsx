import { useState } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';

interface Props {
    onClose: () => void;
    onSave: (seasonData: {
        seasonNumber: number;
        episodes: {
            episodeNumber: number;
            title: string;
        }[];
    }) => void;
}

export default function AddSeasonModal({ onClose, onSave }: Props) {
    const [seasonNumber, setSeasonNumber] = useState(1);
    const [numberOfEpisodes, setNumberOfEpisodes] = useState(1);
    const [episodes, setEpisodes] = useState<{ episodeNumber: number; title: string; }[]>([]);

    const handleGenerateEpisodes = () => {
        const newEpisodes = Array.from({ length: numberOfEpisodes }, (_, i) => ({
            episodeNumber: i + 1,
            title: `Episode ${i + 1}`
        }));
        setEpisodes(newEpisodes);
    };

    const handleSave = () => {
        if (episodes.length === 0) {
            alert('Please generate episodes first');
            return;
        }
        onSave({
            seasonNumber,
            episodes
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-secondary p-6 rounded-lg w-[500px] max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Add New Season</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FiX size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-white text-sm">Season Number</label>
                        <input
                            type="number"
                            className="w-full bg-primary text-white p-2 rounded"
                            value={seasonNumber}
                            onChange={(e) => setSeasonNumber(parseInt(e.target.value))}
                            min={1}
                        />
                    </div>

                    <div>
                        <label className="text-white text-sm">Number of Episodes</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                className="flex-1 bg-primary text-white p-2 rounded"
                                value={numberOfEpisodes}
                                onChange={(e) => setNumberOfEpisodes(parseInt(e.target.value))}
                                min={1}
                            />
                            <button
                                onClick={handleGenerateEpisodes}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center"
                            >
                                <FiPlus className="mr-2" /> Generate
                            </button>
                        </div>
                    </div>

                    {episodes.length > 0 && (
                        <div>
                            <label className="text-white text-sm">Episodes</label>
                            <div className="mt-2 space-y-2">
                                {episodes.map((episode, index) => (
                                    <div key={index} className="bg-primary p-3 rounded">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white">Episode {episode.episodeNumber}</span>
                                            <input
                                                type="text"
                                                className="bg-secondary text-white p-1 rounded w-2/3"
                                                value={episode.title}
                                                onChange={(e) => {
                                                    const newEpisodes = [...episodes];
                                                    newEpisodes[index].title = e.target.value;
                                                    setEpisodes(newEpisodes);
                                                }}
                                                placeholder="Episode title (optional)"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Add Season
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 