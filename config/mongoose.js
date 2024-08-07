const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/finale');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


let gfs;
db.once('open', function(){
    console.log("Connected to MongoDB");
    gfs = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "uploads"
      });
});

module.exports = { db};