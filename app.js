//modules

var express = require('express');
var app = express();
var mysql   = require('mysql');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: ''
});

connection.query('CREATE DATABASE IF NOT EXISTS test_express', function (err) {
    if (err) throw err;
    connection.query('USE test_express', function (err) {
        if (err) throw err;
        connection.query('CREATE TABLE IF NOT EXISTS users (pkid INT NOT NULL AUTO_INCREMENT, name VARCHAR(100),' +
                 'email VARCHAR(100),age VARCHAR(100), PRIMARY KEY(pkid))',
        function(err, result){
    		if(err) {
        		console.log(err);
    		} else {
        		//console.log("Table Created");
    		}
    	});
    });
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.post('/users', function (req, res) {
    connection.query('insert into users (name, email, age) values ("' + req.body.name + '", "' + req.body.email + '", "' + req.body.age + '")' , function (err, result) {
            if (err) throw err;
            res.send('User added to database with the following ID: ' + result.insertId);
        }
    );
});

app.listen(3000);