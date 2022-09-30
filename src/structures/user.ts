import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    user: { type: String, required: true, unique: true },
    voice: { type: String, required: true, default: 'en_us_002' }
});

export default mongoose.model('user', schema);