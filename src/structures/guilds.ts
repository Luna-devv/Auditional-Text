import mongoose from 'mongoose';

const schema = new mongoose.Schema<Guild>({
    guild: { type: String, required: true, unique: true },

    voiceTimeout: { type: Number, required: true, default: 1000 * 30 },
    voiceChannel: { type: String }
});

export const guilds = mongoose.model<Guild>('guild', schema);

export type Guild = {
    guild: string;

    voiceTimeout: number;
    voiceChannel?: string;

    save: () => void;
};