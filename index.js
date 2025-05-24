const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// Middlewares 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('LetsTravel is running....')
});

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.l0f7v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // -------------------------------- DB Collections ------------------------------
    const usersCollections = client.db("letsTravelDB").collection("users");
    const tripsCollections = client.db("letsTravelDB").collection("trips");
    const storiesCollections = client.db("letsTravelDB").collection("stories");
    const destinationsCollections = client.db("letsTravelDB").collection("destinations");


    // ----------------------------------- Get APIs ---------------------------------
    app.get("/users", async (req, res) => {
      const result = await usersCollections.find().toArray();
      res.send(result);
    });
    // Get single user
    app.get("/user", async (req, res) => {
      const userEmail = req.query?.email;
      // console.log(userEmail);
      if (userEmail) {
        const query = { email: userEmail };
        const result = await usersCollections.findOne(query);
        res.send(result);
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    });

    app.get("/trips", async (req, res) => {
      const result = await tripsCollections.find().toArray();
      res.send(result);
    });

    // Get single trip
    app.get("/trip/:id", async (req, res) => {
      const tripId = req.params?.id;
      const query = { _id: new ObjectId(tripId) };
      const result = await tripsCollections.findOne(query);
      res.send(result);

    });

    app.get("/stories", async (req, res) => {
      const result = await storiesCollections.find().toArray();
      res.send(result);
    });

    // Get single story
    app.get("/story/:id", async (req, res) => {
      const storyId = req.params?.id;
      const query = { _id: new ObjectId(storyId) };
      const result = await storiesCollections.findOne(query);
      res.send(result);

    });

    app.get("/destinations", async (req, res) => {
      const result = await destinationsCollections.find().toArray();
      res.send(result);
    });
    // Get single destination
    app.get("/destination/:id", async (req, res) => {
      const destinationId = req.params?.id;
      const query = { _id: new ObjectId(destinationId) };
      const result = await destinationsCollections.findOne(query);
      res.send(result);

    });



    // ----------------------------------- POST APIs ---------------------------------
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollections.insertOne(newUser);
      res.send(result);
    });

    app.post("/trips", async (req, res) => {
      const newTrip = req.body;
      const result = await tripsCollections.insertOne(newTrip);
      res.send(result);
    });

    app.post("/stories", async (req, res) => {
      const newStory = req.body;
      const result = await storiesCollections.insertOne(newStory);
      res.send(result);
    });

    app.post("/destinations", async (req, res) => {
      const newDestination = req.body;
      const result = await destinationsCollections.insertOne(newDestination);
      res.send(result);
    });

    // ----------------------------------- PUT/PATCH APIs ---------------------------------


    // ----------------------------------- Delete APIs ---------------------------------


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`LetsTravel is running on port ${port}`)
})
