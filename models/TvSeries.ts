import mongoose from 'mongoose';

const episodeSchema = new mongoose.Schema({
    episodeNumber: { type: Number, required: true },
    title: { type: String, required: true },
    overview: String,
    airDate: String,
    stillPath: String,
    embedCode: String,
    streamwishId: String,
});

const seasonSchema = new mongoose.Schema({
    seasonNumber: { type: Number, required: true },
    episodes: [episodeSchema],
    combinedEpisodes: [{
        title: String,
        episodeRange: String,
        embedCode: String,
        streamwishId: String,
    }]
});

const tvSeriesSchema = new mongoose.Schema({
    tmdbId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    poster: String,
    backdrop: String,
    genres: [String],
    year: Number,
    rating: Number,
    numberOfSeasons: Number,
    overview: String,
    status: String,
    quality: {
        type: String,
        enum: ['CAM', 'HDCAM', 'HD', 'WebRip', 'WebDL', 'HDTS'],
        default: 'HD'
    },
    streamwishId: {
        type: String,
        default: function () {
            return `${this.tmdbId}_${this.title.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
        }
    },
    inProduction: Boolean,
    lastAirDate: String,
    networks: [String],
    autoSeasons: [{
        seasonNumber: Number,
        episodes: [{
            episodeNumber: Number,
            title: String,
            overview: String,
            airDate: String,
            stillPath: String,
            embedCode: String,
            streamwishId: String
        }]
    }],
    manualSeasons: [{
        seasonNumber: Number,
        episodes: [{
            episodeNumber: Number,
            title: String,
            embedCode: String,
            streamwishId: String
        }]
    }],
    viewMode: {
        type: String,
        enum: ['auto', 'manual'],
        default: 'auto'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Add pre-save middleware to generate streamwishId
tvSeriesSchema.pre('save', function (next) {
    if (!this.streamwishId) {
        this.streamwishId = `${this.tmdbId}_${this.title.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    }
    next();
});

const TvSeries = mongoose.models.TvSeries || mongoose.model('TvSeries', tvSeriesSchema);
export default TvSeries; 