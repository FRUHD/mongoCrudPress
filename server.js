console.log("Hooray, we're programming with Node again!")
const express = require('express');
// const bodyParser= require('body-parser') //deprepcated
const app = express();
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb://FRUHD:wB6wDJEk@cluster0-shard-00-00.qf1ze.mongodb.net:27017,cluster0-shard-00-01.qf1ze.mongodb.net:27017,cluster0-shard-00-02.qf1ze.mongodb.net:27017/?ssl=true&replicaSet=atlas-437pk4-shard-0&authSource=admin&retryWrites=true&w=majority'
// 'mongodb+srv://FRUHD:wB6wDJEk@cluster0.qf1ze.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(connectionString, {useUnifiedTopology: true})
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('emperor-quotes')
        const quotesCollection = db.collection('quotes')

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
            quotesCollection.find().toArray()
                .then(results => {
                    console.log(results)
                    res.render('index.ejs', {quotes: results})
                })
                .catch(error => console.error(error))
            
            // res.sendFile(__dirname + '/index.html') //serve index.html in root of project folder
        })
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    console.log(result)
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })
        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
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
            })
            .catch(error => console.error(error))
        })
        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
              { name: req.body.name }
            )
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.json('No quote to delete')
                }
                res.json('Deleted Darth Vadar\'s quote')
            })
            .catch(error => console.error(error))
        })
        
        // ========================
        // Listen
        // ========================
        const isProduction = process.env.NODE_ENV === 'production'
        const port = isProduction ? 7500 : 3000
        app.listen(port, function() {
            console.log(`listening on ${port}`)
        })
    })
    .catch(error => console.error(error))

//RUN npm run dev

//continue: Using EJS
//Mayan: https://www.twitch.tv/videos/1312648574 @ 3:27:36

// Body-parser
// app.use(bodyParser.urlencoded({ extended: true }))  // Deprecated