const fs = require('fs');
const mongoose = require('mongoose');

// MongoDB connection string is read from the environment ONLY. Never hard-code
// credentials in source. Provide MONGODB_URI at runtime (e.g. via a local
// untracked .env file). See .env.example. The two Atlas credentials that were
// previously hard-coded here have been REMOVED for security; they MUST be
// rotated because they remain in git history.
const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error('MONGODB_URI environment variable is not set. Aborting import.');
  process.exit(1);
}

const collegeSchema = new mongoose.Schema({}, { strict: false }); 
const College = mongoose.model('College', collegeSchema);

async function importData() {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected! Reading colleges.json...");

    const rawData = fs.readFileSync('./colleges.json', 'utf-8');
    const colleges = JSON.parse(rawData);

    console.log(`Found ${colleges.length} colleges. Pushing to database (this might take a minute)...`);
    await College.insertMany(colleges);
    
    console.log("✅ All data successfully imported!");
    process.exit();
  } catch (error) {
    console.error("❌ Error importing data:", error);
    process.exit(1);
  }
}

importData();
