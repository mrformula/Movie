import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import TvSeries from '@/models/TvSeries';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    await connectDB();

    if (req.method === 'POST') {
        try {
            const { seasonNumber, episodes } = req.body;

            const series = await TvSeries.findById(id);
            if (!series) {
                return res.status(404).json({ error: 'TV series not found' });
            }

            // Check if season already exists in manualSeasons
            const seasonExists = series.manualSeasons?.some(
                (s: any) => s.seasonNumber === seasonNumber
            );

            if (seasonExists) {
                return res.status(400).json({ error: 'Season already exists' });
            }

            // Format episodes
            const formattedEpisodes = episodes.map((episode: any) => ({
                episodeNumber: episode.episodeNumber,
                title: episode.title || `Episode ${episode.episodeNumber}`,
                embedCode: '',
                streamwishId: ''
            }));

            // Add to manualSeasons
            if (!series.manualSeasons) {
                series.manualSeasons = [];
            }

            series.manualSeasons.push({
                seasonNumber,
                episodes: formattedEpisodes
            });

            // Sort seasons
            series.manualSeasons.sort((a: any, b: any) => a.seasonNumber - b.seasonNumber);

            await series.save();
            res.status(201).json(series);
        } catch (error) {
            console.error('Error adding season:', error);
            res.status(500).json({ error: 'Error adding season' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
} 