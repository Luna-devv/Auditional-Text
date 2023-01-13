import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    user: { type: String, required: true, unique: true },
    voice: { type: String, required: true, default: 'en_us_002' },

    votes: {
        uses: { type: Number, required: true, default: 0 },
        voteEndsCache: { type: Date },
    }
});

export const users = mongoose.model('user', schema);

export type User = {
    user: string;
    voice: string;

    votes: {
        uses: number;
        voteEndsCache: Date;
    },

    save: () => void;
};