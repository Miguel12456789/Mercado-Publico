const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn1 = mongoose.createConnection(process.env.MONGO_URI_1);
        const conn1_1 = mongoose.createConnection(process.env.MONGO_URI_1_1);
        const conn2 = mongoose.createConnection(process.env.MONGO_URI_2);
        const conn3 = mongoose.createConnection(process.env.MONGO_URI_3);
        const conn4 = mongoose.createConnection(process.env.MONGO_URI_4);
        const conn5 = mongoose.createConnection(process.env.MONGO_URI_5);

        await Promise.all([
            new Promise((resolve, reject) => {
                conn1.once('connected', resolve);
                conn1.once('error', reject);
            }),
            new Promise((resolve, reject) => {
                conn1_1.once('connected', resolve);
                conn1_1.once('error', reject);
            }),
            new Promise((resolve, reject) => {
                conn2.once('connected', resolve);
                conn2.once('error', reject);
            }),
            new Promise((resolve, reject) => {
                conn3.once('connected', resolve);
                conn3.once('error', reject);
            }),
            new Promise((resolve, reject) => {
                conn4.once('connected', resolve);
                conn4.once('error', reject);
            }),
            new Promise((resolve, reject) => {
                conn5.once('connected', resolve);
                conn5.once('error', reject);
            }),
        ]);

        console.log(`MongoDB Cluster 1 Connected: ${conn1.name}`);
        console.log(`MongoDB Cluster 1_1 Connected: ${conn1_1.name}`);
        console.log(`MongoDB Cluster 2 Connected: ${conn2.name}`);
        console.log(`MongoDB Cluster 3 Connected: ${conn3.name}`);
        console.log(`MongoDB Cluster 4 Connected: ${conn4.name}`);
        console.log(`MongoDB Cluster 5 Connected: ${conn5.name}`);

        // Listar collections de cada base
        const listCollections = async (conn, label) => {
            const collections = await conn.db.listCollections().toArray();
            const names = collections.map(c => c.name);
            console.log(`Collections em ${label} (${conn.name}):`, names);
        };

        await Promise.all([
            listCollections(conn1, 'Cluster 1'),
            listCollections(conn1_1, 'Cluster 1_1'),
            listCollections(conn2, 'Cluster 2'),
            listCollections(conn3, 'Cluster 3'),
            listCollections(conn4, 'Cluster 4'),
            listCollections(conn5, 'Cluster 5'),
        ]);

        return { conn1, conn1_1, conn2, conn3, conn4, conn5 };
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
