const { MongoClient } = require("mongodb");
var uri = "mongodb+srv://admin:admin@isentinel.fw6fyxk.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function addEventToBDD(id, end_time, anomaly_type, camera_id, path) {
    async function run() {
      try {
        await client.connect();
        const database = client.db('ISENtinel');
        const collection = database.collection('EVENT');
        // create a document to be inserted
        const doc = checkEventObject(id, end_time, anomaly_type, camera_id, path);
        const result = await collection.insertOne(doc);
        console.log("Object have been inserted into the collection with the id ", result.insertedId);
      } catch (err) {
        console.error(err);
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }
    run().catch(console.dir);
}

async function editEventFromBDD(event_id, new_end_time, new_anomaly_type, new_camera_id, new_path) {

    async function run() {
        try {
            await client.connect();
            const database = client.db('ISENtinel');
            const collection = database.collection('EVENT');
            const result = await
            collection.updateOne({id: event_id}, {$set: {end_time: new_end_time, anomaly_type: new_anomaly_type, camera_id: new_camera_id, path: new_path}});
        }
        catch (err) {
            console.error(err);
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
}

async function deleteEventFromBDD(event_id) {
    
        async function run() {
        try {
            await client.connect();
            const database = client.db('ISENtinel');
            const collection = database.collection('EVENT');
            const result = await collection.deleteOne({id: event_id});
        }
        catch (err) {
            console.error(err);
        } finally {
            await client.close();
        }
    }
    run().catch(console.dir);
}

async function getEventsFromBDD(event_id) {
    async function run() {
        try {
            await client.connect();
            const database = client.db('ISENtinel');
            const collection = database.collection('EVENT');
            let table_event = [];
            const events = await collection.find({}).toArray();
            for(const event of events) {
                const result = {
                    id: event.id,
                    end_time: event.end_time,
                    anomaly_type: event.anomaly_type,
                    camera_id: event.camera_id,
                    path: event.path
                };
                table_event.push(result);
            }
            return table_event;
        }
        catch (err) {
            console.error(err);
        } finally {
            await client.close();
        }
    }
    return run().catch(console.dir);
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
    addEventToBDD,
    deleteEventFromBDD,
    editEventFromBDD,
    getEventsFromBDD
};
