require('dotenv').load();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection details
const url = process.env.MONGODB_CONNECTION_STRING;
const dbName = process.env.MONGODB_DATABASE;
const collectionName = process.env.MONGODB_DEFAULT_COLLECTION;

const client = new MongoClient(url, { 
    useNewUrlParser: true 
});

const insertDocuments = function(db, callback) {
    const collection = db.collection(collectionName);

    collection.insertMany([
        {
            "name" : "ICSE'41",
            "edition" : 41,
            "year" : 2019,
            "created_at" : new Date("2019/01/13").toISOString(),
            "general_chair" : "Joanne M. Atlee",
            "duration" : {
              "begin" : new Date("2019/05/25").toISOString(),
              "end" : new Date("2019/05/31").toISOString()
            },
            "url" : "https://conf.researchr.org/home/icse-2019",
            "location" : {
                "province" : "QC",
                "city" : "Montreal",
                "country" : "Canada"
            },
            "tracks" : [
              {
                "name" : "technical track",
                "topic" : "research",
                "chairs" : ["Tevfik Bultan", "Jon Whittle"]
              },
              {
                "name" : "journal first",
                "topic" : "research",
                "elligible_journals" : ["TSE", "TOSEM", "ESEM"],
                "chairs" : ["Betty Cheng"]
              },
              {
                "name" : "software engineering in practice",
                "topic" : "practice",
                "chairs" : ["Helen Sharp", "Michael Whalen"]
              }
            ]
          },

          {
            "name" : "MSR'16",
            "edition" : 16,
            "year" : 2019,
            "created_at" : new Date("2019/01/20").toISOString(),
            "general_chair" : "Margaret-Anne Storey",
            "duration" : {
                "begin" : new Date("2019/05/26").toISOString(),
                "end" : new Date("2019/05/27").toISOString()
            },
            "url" : "https://conf.researchr.org/home/msr-2019",
            "co_located_with" : "ICSE'41",
            "tracks" : [
              {
                "name" : "technical track",
                "topic" : "research",
                "chairs" : ["Bram Adams", "Sonia Haiduc"]
              }
            ]
          },
          
          {
            "name" : "ICSE'42",
            "edition" : 42,
            "year" : 2020,
            "created_at" : new Date("2019/01/25").toISOString(),
            "general_chair" : "Gregg Rothermel",
            "duration" : {
                "begin" : new Date("2019/05/23").toISOString(),
                "end" : new Date("2019/05/29").toISOString()
            },
            "url" : "https://conf.researchr.org/home/icse-2020",
            "location" : {
                "country" : "South Korea"
            },
            "tracks" : [
              {
                "name" : "technical track",
                "topic" : "research",
                "chairs" : ["Jane Cleland-Huang", "Darko Marinov"]
              }
            ]
          },
          
          {
            "name" : "ICPE'10",
            "edition" : 10,
            "year" : 2019,
            "created_at" : new Date("2019/01/28").toISOString(),
            "general_chair" : "Varsha Apte",
            "duration" : {
                "begin" : new Date("2019/04/07").toISOString(),
                "end" : new Date("2019/04/11").toISOString()
            },
            "url" : "https://icpe2019.spec.org",
            "location" : {
                "city" : "Mumbai",
                "country" : "India"
            },
            "tracks" : [
              {
                "name" : "technical track",
                "topic" : "research",
                "chairs" : ["Marin Litoiu", "Jose Merseguer"]
              },
              {
                "name" : "industry track",
                "topic" : "practice",
                "chairs" : ["David Schmidt"]
              }
            ]
          },
          
          {
            "name" : "WEPPE'2",
            "edition" : 2,
            "year" : 2019,
            "general_chair" : "Alberto Avritzer",
            "url" : "https://esulabsolutions.godaddysites.com/sponsored-events",
            "co_located_with" : "ICPE'10",
            "tracks" : [
              {
                "name" : "main track",
                "topic" : "research",
                "chairs" : ["Alberto Avritzer", "Kishor Trivedi"]
              }
            ]
          }
    ], function(err, result) {
        assert.equal(err, null);
        callback(result);
    });
};

const searchDocuments = function(db, searchCollection, query = {}, callback) {
    const collection = db.collection(searchCollection);

    collection.find(query).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};

const logDocuments = function(docs) {
    console.log('============== Listing documents ===============');
    console.log(docs);
};

// Connect to server
client.connect(function(err, db) {
    assert.equal(null, err);
    console.log('Connected successfully to mongodb server');

    const dbo = client.db(dbName);

    dbo.collection(collectionName).drop(function(err, result) {
        assert(err, null);
        console.log('Collection deleted');
    });

    dbo.createCollection(collectionName, function(err, result) {
        assert(err, null);
        console.log('Collection created');
    });

    insertDocuments(dbo, function() {
        console.log('Inserted documents into collection ' + collectionName);
    });

    searchDocuments(dbo, collectionName, { name: "ICPE'10" }, logDocuments);
    searchDocuments(dbo, collectionName, { year: { $gte: 2018 } }, logDocuments);
    searchDocuments(dbo, collectionName, { created_at: { $gte: new Date('2019/01/20').toISOString() } }, logDocuments);
    searchDocuments(dbo, collectionName, { 
        "duration.begin": {
            $gte: new Date('2019/05/24').toISOString()
        } 
    }, logDocuments);

    dbo.collection(collectionName).drop(function(err, result) {
        assert(err, null);
        console.log('Collection deleted');
    });

    db.close();
});