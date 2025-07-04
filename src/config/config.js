const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("MONGO_URI_1:", process.env.MONGO_URI_1);
        const conn1 = mongoose.createConnection(process.env.MONGO_URI_1);
        await new Promise((resolve, reject) => {
            conn1.once('connected', resolve);
            conn1.once('error', reject);
        });
        console.log(`MongoDB Cluster 1 Connected: ${conn1.db.databaseName}`);

        console.log("MONGO_URI_2:", process.env.MONGO_URI_2);
        const conn2 = mongoose.createConnection(process.env.MONGO_URI_2);
        await new Promise((resolve, reject) => {
            conn2.once('connected', resolve);
            conn2.once('error', reject);
        });
        console.log(`MongoDB Cluster 2 Connected: ${conn2.db.databaseName}`);

        // Retorne as conexões para uso posterior
        return { conn1, conn2 };
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;