import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { MongoClient } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "build")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Date of today used to compare dates and categorize drops into current future and previous
const todayDate = new Date();

//api to get all the current drops from the database
app.get("/api/getCurrentDrops", async (req, res) => {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017", {
      useNewUrlParser: true,
    });
    const db = client.db("twitchdrops");

    const dropsInfo = await db.collection("drops").find({}).toArray();

    const currentDrops = []
    for (let i=0; i<dropsInfo.length; i++) {
      //console.log(i, dropsInfo[i]);

      if (new Date(dropsInfo[i].start_date) <= todayDate && todayDate <= new Date(dropsInfo[i].end_date)) {
        currentDrops.push(dropsInfo[i]);
      }
    }
    console.log(currentDrops);

    res.status(200).json(currentDrops);
    client.close();
  } catch (error) {
    res.status(500).json({ message: "Error connecting to database", error });
  }
});

//api to get all the future drops from the database
app.get("/api/getFutureDrops", async (req, res) => {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017", {
      useNewUrlParser: true,
    });
    const db = client.db("twitchdrops");

    const dropsInfo = await db.collection("drops").find({}).toArray();
    //console.log(dropsInfo);
    const futureDrops = []
    for (let i=0; i<dropsInfo.length; i++) {
      //console.log(i, dropsInfo[i]);

      if (new Date(dropsInfo[i].start_date) > todayDate) {
        futureDrops.push(dropsInfo[i]);
      }
    }
    console.log(futureDrops);

    res.status(200).json(futureDrops);
    client.close();
  } catch (error) {
    res.status(500).json({ message: "Error connecting to database", error });
  }
});

//api to get all the previous drops from the database
app.get("/api/getPreviousDrops", async (req, res) => {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017", {
      useNewUrlParser: true,
    });
    const db = client.db("twitchdrops");

    const dropsInfo = await db.collection("drops").find({}).toArray();
    //console.log(dropsInfo);
    const previousDrops = []
    for (let i=0; i<dropsInfo.length; i++) {
      //console.log(i, dropsInfo[i]);

      if (todayDate > new Date(dropsInfo[i].end_date)) {
        previousDrops.push(dropsInfo[i]);
      }
    }
    console.log(previousDrops);

    res.status(200).json(previousDrops);
    client.close();
  } catch (error) {
    res.status(500).json({ message: "Error connecting to database", error });
  }
});

//api to get all the faqs from the database
app.get("/api/getFaqs", async (req, res) => {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017", {
      useNewUrlParser: true,
    });
    const db = client.db("twitchdrops");

    const faqsInfo = await db.collection("faqs").find({}).toArray();
    //console.log(faqsInfo);
    res.status(200).json(faqsInfo);
    client.close();
  } catch (error) {
    res.status(500).json({ message: "Error connecting to db", error });
  }
});

//api key used for validating if a user can update the database through post requests
const key = "234kjn345n23l4knh2g3v4v4534h5g2v";

//api to overwrite all drops in database with new ones
app.post("/api/overwriteDrops", async (req, res) => {
  if (req.headers.key == key) {
    try {
      let newDrops = req.body;
      const client = await MongoClient.connect("mongodb://localhost:27017", {
        useNewUrlParser: true,
      });
      const db = client.db("twitchdrops");
      await db.collection("drops").deleteMany({});
      await db.collection("drops").insertMany(newDrops)
      res
        .status(200)
        .json({ message: "Drops overwritten successfully.", drops: req.body });
      client.close();
    } catch (error) {
      res.status(500).json({ message: "Error connecting to db", error });
    }
  }
});

//api to update a current drop that matches the itemdefid of the request
app.post("/api/updateCurrentDrop", async (req, res) => {
  if (req.headers.key == key) {
    try {
      let updatedDrop = req.body;
      console.log(updatedDrop.itemdefid);
      const client = await MongoClient.connect("mongodb://localhost:27017", {
        useNewUrlParser: true,
      });
      const db = client.db("twitchdrops");
      

      const dropsInfo = await db.collection("drops").updateMany({ 'start_date': {'$lte': todayDate.toISOString()}, 'end_date': {'$gte': todayDate.toISOString()}
      }, 
      {'$set': {'drops.$[elem].streamer_name': updatedDrop.streamer_name, 'drops.$[elem].item_name': updatedDrop.item_name, 'drops.$[elem].unlock_condition': updatedDrop.unlock_condition}},
      {arrayFilters: [{'elem.itemdefid': updatedDrop.itemdefid}]})

      
     res
     .status(200)
     .json({ message: dropsInfo});
      client.close();
    } catch (error) {
      res.status(500).json({ message: "Error connecting to db", error });
    }
  }
});

//updates all faq with a new set
app.post("/api/updateFaq", async (req, res) => {
  if (req.headers.key == key) {
    try {
      let newFAQs = req.body;
      const client = await MongoClient.connect("mongodb://localhost:27017", {
        useNewUrlParser: true,
      });
      const db = client.db("twitchdrops");
      await db.collection("faqs").deleteMany({});
      await db.collection("faqs").insertMany(newFAQs)
      res
        .status(200)
        .json({ message: "FAQs updated successfully.", faqs: req.body });
      client.close();
    } catch (error) {
      res.status(500).json({ message: "Error connecting to db", error });
    }
  }
});

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname + "/build/index.html"))
);

app.listen(8000, () => console.log("Listening on port 8000"));
