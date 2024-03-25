const { MongoClient } = require("mongodb");
var uri = "mongodb+srv://admin:admin@isentinel.fw6fyxk.mongodb.net/";
const client = new MongoClient(uri);

function addEventToBDD(id, end_time, anomaly_type, camera_id, path) {

    async function run() {
      try {
        const database = client.db('ISENtinel');
        const collection = database.collection('EVENT');
        // create a document to be inserted
        const doc = checkEventObject(id, end_time, anomaly_type, camera_id, path);
        const result = await collection.insertOne(doc);
        console.log("Object have been inserted into the collection with the id ", result.insertedId);

      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }
    run().catch(console.dir);

}

function checkEventObject(id, end_time, anomaly_type, camera_id, path){
    
    // Create an object to represent the event
    let myobj = {
        id: id,
        end_time: end_time,
        anomaly_type: anomaly_type,
        camera_id: camera_id,
        path: path
    };
    
    // Check that id is a string, end_time is a string, anomaly_type is a string, camera_id is an integer, and path is a string
    if (typeof id !== 'string') {
        throw new Error('id must be a string');
        return;
    }
    if (typeof end_time !== 'string') {
        throw new Error('end_time must be a string');
        return;
    }
    if (typeof anomaly_type !== 'string') {
        throw new Error('anomaly_type must be a string');
        return;
    }
    if (typeof camera_id !== 'number') {
        throw new Error('camera_id must be a number');
        return;
    }
    if (typeof path !== 'string') {
        throw new Error('path must be a string');
        return;
    }

    return myobj;
}

module.exports = {
    addEventToBDD
};
