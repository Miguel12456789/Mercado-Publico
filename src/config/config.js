// config/config.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn1 = mongoose.createConnection(process.env.MONGO_URI_1);
    const conn2 = mongoose.createConnection(process.env.MONGO_URI_2);

    await Promise.all([
      new Promise((resolve, reject) => {
        conn1.once('connected', resolve);
        conn1.once('error', reject);
      }),
      new Promise((resolve, reject) => {
        conn2.once('connected', resolve);
        conn2.once('error', reject);
      }),
    ]);

    console.log(`MongoDB Cluster 1 Connected: ${conn1.name}`);
    console.log(`MongoDB Cluster 2 Connected: ${conn2.name}`);

    return { conn1, conn2 };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
