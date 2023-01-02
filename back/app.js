const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')
const path = require('path');
mongoose.plugin(mongodbErrorHandler);

mongoose.connect('mongodb://<USERNAME>:<PASSWORD>@ac-oqhjsts-shard-00-00.qhbugk8.mongodb.net:27017,ac-oqhjsts-shard-00-01.qhbugk8.mongodb.net:27017,ac-oqhjsts-shard-00-02.qhbugk8.mongodb.net:27017/?ssl=true&replicaSet=atlas-zpya41-shard-0&authSource=admin&retryWrites=true&w=majority',
  
{
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log(error));

const app = express()


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(bodyParser.json())

app.use('/api/auth', userRoutes)
app.use('/api/sauces', saucesRoutes)

app.use('/images', express.static(path.join(__dirname, 'images')));
module.exports = app


