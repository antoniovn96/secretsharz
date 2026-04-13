const fs = require('fs');
const mongoose = require('mongoose');

// ⚠️ REPLACE THIS STRING WITH YOUR ACTUAL MONGODB STRING ⚠️
const MONGO_URI = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/vidyavantage?retryWrites=true&w=majority";

const collegeSchema = new mongoose.Schema({}, { strict: false }); // Flexible schema to accept anything in your JSON
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
