import mongoose from 'mongoose';

export default async function handler(req, res) {
  try {
    // If we aren't connected, connect now
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    
    const College = mongoose.models.College || mongoose.model('College', new mongoose.Schema({}, { strict: false }));
    const colleges = await College.find({}).limit(20);
    
    return res.status(200).json(colleges);
  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: "Failed to fetch" });
  }
}