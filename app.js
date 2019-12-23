var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var dbconfig = require("./config/databaseConnection");
var connection = mysql.createConnection(dbconfig.connection);
var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
//App settings
app.set('view engine', 'ejs');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.disable('x-powered-by');//off standart header to allow protection
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var SqlRequests = require("./app/SqlRequests.js");//
require('./app/SqlRequests.js')(connection);
require('./app/routes.js')(app, connection, SqlRequests.getCountriesList(connection));


//Server port
app.listen(3000, function (err) {
    if (err) throw error;
    console.log("Server is running on port 3000");
});




