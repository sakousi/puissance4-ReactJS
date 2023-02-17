const mongoose = require("mongoose");

exports.connectDB = async () => {
  await mongoose.connect("mongodb://admin:password@localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("MongoDB connected");
};

// exports.connectDB = connectDB;
