console.log("Hooray, we're programming with Node again!")
const express = require('express');
// const bodyParser= require('body-parser') //deprepcated
const app = express();
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()  //secret env
// const connectionString = 'mongodb://FRUHD:<>@cluster0-shard-00-00.qf1ze.mongodb.net:27017,cluster0-shard-00-01.qf1ze.mongodb.net:27017,cluster0-shard-00-02.qf1ze.mongodb.net:27017/?ssl=true&replicaSet=atlas-437pk4-shard-0&authSource=admin&retryWrites=true&w=majority'
// // 'mongodb+srv://FRUHD:<>@cluster0.qf1ze.mongodb.net/?retryWrites=true&w=majority'

// MongoClient.connect(connectionString, {useUnifiedTopology: true})
//     .then(client => {
//         console.log('Connected to Database')
//         const db = client.db('emperor-quotes')
//         const quotesCollection = db.collection('quotes')

let db,
    dbConnectionString = process.env.DB_STRING,
    dbName = 'emperor-quotes',    //get from MongoDB
    collection

MongoClient.connect(dbConnectionString)
    .then(client => {
        console.log('Connected to Database!')
        db = client.db(dbName)
        collection = db.collection('quotes')    //get from MongoDB

        // ========================
        // Middlewares
        // ========================
        app.set('view engine', 'ejs')
        app.use(express.urlencoded({extended: true}))  // Per Rascal
        app.use(express.json())
        app.use(express.static('public'))
        
        // ========================
        // Routes/Handlers go here
        // ========================
        app.get('/', (req, res) => {
            console.log('REQUEST')
            collection.find().toArray()
                .then(results => {
                    console.log(results)
                    res.render('index.ejs', {quotes: results})
                })
                .catch(error => console.error(error))
            
            // res.sendFile(__dirname + '/index.html') //serve index.html in root of project folder
        })
        app.post('/quotes', (req, res) => {
            collection.insertOne(req.body)
                .then(result => {
                    console.log(result)
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })
        app.put('/quotes', (req, res) => {
            collection.findOneAndUpdate(
                { name: 'Kuzco' },
                {
                    $set: {
                      name: req.body.name,
                      quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
            .then(result => {
                console.log(result)
                res.json('Success')
            })
            .catch(error => console.error(error))
        })
        app.delete('/quotes', (req, res) => {
            collection.deleteOne(
              { name: req.body.name }
            )
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.json('No quote to delete')
                }
                res.json('Deleted Yzma\'s quote')
            })
            .catch(error => console.error(error))
        })
        
        // ========================
        // Listen
        // ========================
        // const isProduction = process.env.NODE_ENV === 'production'
        // const port = isProduction ? 7500 : 3000
        app.listen(3000, function() {
            console.log(`listening on 3000`)
        })
    })
    .catch(error => console.error(error))

//RUN npm run dev

//continue: Using EJS
//Mayan: https://www.twitch.tv/videos/1312648574 @ 3:27:36

// Body-parser
// app.use(bodyParser.urlencoded({ extended: true }))  // Deprecated