const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())

// code copy from the mongodb

console.log(process.env.Db_User)
console.log(process.env.Db_Pass)

// const user = process.env.Db_User;
// const password = process.env.Db_Pass;



const uri = `mongodb+srv://${process.env.Db_User}:${process.env.Db_Pass}@cluster0.znemmfr.mongodb.net/?retryWrites=true&w=majority`;

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

    const database = client.db("pizzaDB");
    const pizzaCollection = database.collection("pizza");

   

   

    app.get('/pizzas',async(req,res)=>{
        const cursor = pizzaCollection.find();
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/pizzas/:id',async(req,res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await pizzaCollection.findOne(query)
        res.send(result)
    })

    app.post('/pizzas',async(req,res)=>{
        const pizza = req.body;
        console.log(pizza)
        const result = await pizzaCollection.insertOne(pizza);
        res.send(result)
    })

    app.put('/pizzas/:id',async(req,res)=>{
        const id = req.params.id;
        const updatePizza = req.body;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const  pizza= {
            $set: {
              name: updatePizza.name,
              quantity: updatePizza.quantity,
              supplier: updatePizza.supplier,
              cheif: updatePizza.cheif,
              quality: updatePizza.quality,
              details: updatePizza.details,
              photourl: updatePizza.photourl,
            },
          };
        const result = await pizzaCollection.updateOne(filter, pizza, options);
        res.send(result)
    })

    app.delete('/pizzas/:id',async(req,res)=>{
        const id = req.params.id;
        console.log("delete the pizza", id)
        const query = { _id: new ObjectId(id) };
        const result = await pizzaCollection.deleteOne(query);
        res.send(result)
    })

    
    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



// code copy from mongodb

app.get('/', (req,res)=>{
    res.send("server is running on the port 5000")
})

app.listen(port,()=>{
    console.log(`Server is running on the port ${port}`)
})