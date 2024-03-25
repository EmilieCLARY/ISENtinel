var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:admin@isentinel.fw6fyxk.mongodb.net/";

var dbo = db.db("ISENtinel");
var EVENT = dbo.collection("EVENT");
var PROFILE = dbo.collection("PROFILE");
var ANOMALY_DEGREE = dbo.collection("ANOMALY_DEGREE");

function addEventToBDD(id, end_time, anomaly_type, camera_id, path) {
    let myobj_checked = checkEventObject(id, end_time, anomaly_type, camera_id, path);    
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        EVENT.insertOne(myobj_checked, function(err, res) {
            if (err) throw err;
            console.log("1 event inserted");
            db.close();
        });
    });
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
    addItemsToCollection,
    addEventToBDD
};
