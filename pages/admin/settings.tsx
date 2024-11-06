import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FiShield } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface Settings {
    adBlockEnabled: boolean;
    popupBlockEnabled: boolean;
    redirectBlockEnabled: boolean;
    blockSocialMedia: boolean;
    blockTracking: boolean;
    blockInlineScripts: boolean;
}

export default function Settings() {
    const [settings, setSettings] = useState<Settings>({
        adBlockEnabled: true,
        popupBlockEnabled: true,
        redirectBlockEnabled: true,
        blockSocialMedia: true,
        blockTracking: true,
        blockInlineScripts: true
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const updateSettings = async (updates: Partial<Settings>) => {
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (!res.ok) throw new Error('Failed to update settings');

            toast.success('Settings updated successfully');
            fetchSettings();
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error('Error updating settings');
        }
    };

    return (
        <DashboardLayout>
            <div className="bg-secondary rounded-lg p-6">
                <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

                <div className="space-y-6">
                    {/* Ad Blocking Section */}
                    <div className="bg-primary rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                                    <FiShield className="w-6 h-6 text-purple-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Security Settings</h2>
                                    <p className="text-gray-400 text-sm">Control security and blocking features</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-white font-medium">Ad Blocker</h3>
                                    <p className="text-sm text-gray-400">Block all advertisements</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.adBlockEnabled}
                                        onChange={(e) => updateSettings({ adBlockEnabled: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-white font-medium">Block Social Media</h3>
                                    <p className="text-sm text-gray-400">Block social media widgets and trackers</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.blockSocialMedia}
                                        onChange={(e) => updateSettings({ blockSocialMedia: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-white font-medium">Block Tracking</h3>
                                    <p className="text-sm text-gray-400">Block analytics and tracking pixels</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.blockTracking}
                                        onChange={(e) => updateSettings({ blockTracking: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-white font-medium">Block Inline Scripts</h3>
                                    <p className="text-sm text-gray-400">Block potentially harmful inline scripts</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.blockInlineScripts}
                                        onChange={(e) => updateSettings({ blockInlineScripts: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 