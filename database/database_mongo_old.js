const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase(){
    const uri = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME;

    const client = await MongoClient.connect(uri);
    database = client.db(dbName);

    // Ensure indexes (unique email)
    await database.collection('users').createIndex({ email: 1 }, { unique: true });
}

function getDb(){
    if(!database){
        throw new Error('Database not connected');
    }
    return database;
}

module.exports = {
    connectToDatabase: connectToDatabase,
    getDb: getDb
}