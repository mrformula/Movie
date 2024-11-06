import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    tmdbId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    poster: String,
    genres: [String],
    year: Number,
    rating: Number,
    overview: String,
    runtime: Number,
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
    embedCode: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Add pre-save middleware to generate streamwishId
movieSchema.pre('save', function (next) {
    if (!this.streamwishId) {
        this.streamwishId = `${this.tmdbId}_${this.title.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    }
    next();
});

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);
export default Movie; 