const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const localUri = process.env.MONGODB_URI_LOCAL;

exports.connectDB = async () => {
  try {

    await mongoose.connect(localUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "connect4",
    });
    console.log("MongoDB connected", localUri);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}