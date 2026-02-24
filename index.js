const express = require("express");
const cors = require("cors")
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

//<---------------------***************------------------------->

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.llva5me.mongodb.net/?appName=Cluster0`;
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
    await client.connect();
    const newCoffeeCollection = client.db("coffeeDB").collection("newCoffees");
    const usersCollection = client.db("coffeeDB").collection("users")
    //<------------********------------>
    app.get("/newCoffees",async(req,res)=>{
      const result = await newCoffeeCollection.find().toArray();
      res.send(result);
    });

    app.get("/newCoffees/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await newCoffeeCollection.findOne(query)
      res.send(result)
    })

    app.post("/newCoffees",async(req,res)=>{
       const newCoffee = req.body;
       console.log(newCoffee);
       const result = await newCoffeeCollection.insertOne(newCoffee);
       res.send(result);
    })

    app.put('/newCoffees/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedCoffee = req.body;
      const updateDoc = {
        $set: updatedCoffee
      }
      const result = await newCoffeeCollection.updateOne(filter, updateDoc, options)
       res.send(result)
    })

    app.delete("/newCoffees/:id",async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await newCoffeeCollection.deleteOne(query);
      res.send(result)

    })
     //<------------********------------>
     //<------------********------------>
     //get all the users data
     app.get("/users", async(req, res)=>{
      const result = await usersCollection.find().toArray()
      res.send(result)
     })
     //post user data
     app.post("/users",async(req, res) =>{
      const userProfile = req.body;
      console.log(userProfile)
      const result = await usersCollection.insertOne(userProfile);
      res.send(result)
     })

     //delete user
        app.delete("/users/:id",async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await usersCollection.deleteOne(query)
        res.send(result)

      })

      // existing users activity change , like login time 

      app.patch("/users", async(req,res)=>{
        console.log(req.body)

        const {email,  lastSignInTime} = req.body
        const filter = {email : email}

        const updateDoc = {
          $set : {
            lastSignInTime :lastSignInTime 
          }
        }
 const result = await usersCollection.updateOne(filter, updateDoc)
          res.send(result)
      })
     //<------------********------------>

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  
  finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);


//<---------------------***************------------------------->

app.get("/",(req,res)=>{
    res.send("Coffee Server Is Getting Hotter")
})

app.listen(port,()=>{
    console.log(`Coffee Server Is Running on Port ${port}`)
})