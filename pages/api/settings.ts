import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// Create Settings Schema
const settingsSchema = new mongoose.Schema({
    adBlockEnabled: { type: Boolean, default: true },
    popupBlockEnabled: { type: Boolean, default: true },
    redirectBlockEnabled: { type: Boolean, default: true }
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();

    if (req.method === 'GET') {
        try {
            let settings = await Settings.findOne();
            if (!settings) {
                settings = await Settings.create({
                    adBlockEnabled: true,
                    popupBlockEnabled: true,
                    redirectBlockEnabled: true
                });
            }
            res.status(200).json(settings);
        } catch (error) {
            console.error('Error fetching settings:', error);
            res.status(500).json({ error: 'Error fetching settings' });
        }
    }
    else if (req.method === 'PUT') {
        try {
            const updates = req.body;
            let settings = await Settings.findOne();

            if (!settings) {
                settings = await Settings.create({
                    ...updates,
                    adBlockEnabled: true,
                    popupBlockEnabled: true,
                    redirectBlockEnabled: true
                });
            } else {
                settings = await Settings.findOneAndUpdate(
                    {},
                    updates,
                    { new: true }
                );
            }

            res.status(200).json(settings);
        } catch (error) {
            console.error('Error updating settings:', error);
            res.status(500).json({ error: 'Error updating settings' });
        }
    }
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
} 