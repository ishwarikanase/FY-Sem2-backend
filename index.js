const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var routes = require('./routes/routesIndex');
mongoose.Promise = global.Promise;
const cors = require('cors')

const app = express();
const port = 3000;
const databaseURL = 'mongodb://localhost:27017/splitwise';


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', routes);
app.use(cors());

mongoose.connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, function () { }).then(() => {
    console.log("successfully connected to database...");
}).catch(err => {
    console.error("error connecting database", err.stack);
    process.exit(1);
});

app.listen(port, () => {
    console.log("server is running on port " + port);
})
