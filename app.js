//modules

var express = require('express');
var path = require('path');
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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));


//read
app.get('/', function(req, res){
	//res.sendFile(__dirname + '/index.html');
	connection.query('SELECT * FROM users', function(err, rows){
 		res.render('users', {users : rows});
 	});
});


//create
app.post('/users', function (req, res) {
    connection.query('insert into users (name, email, age) values ("' + req.body.name + '", "' + req.body.email + '", "' + req.body.age + '")' , function (err, result) {
            if (err) throw err;
            res.send('User added to database with the following ID: ' + result.insertId);
        }
    );
});

//delete
app.post('/:id', function (req, res) {
    var id = req.params.id;
    var isAjaxRequest = req.xhr;
    console.log("isAjaxRequest: " + isAjaxRequest);
    console.log("ID is: " + id);
    connection.query('delete from users where pkid= ?', id, function(err, result){
        if (err){
            throw err;
        }
        console.log('Deleted ' + result.affectedRows + ' row');
        var response = {
            status  : 200,
            success : 'Updated Successfully'
        }
        res.end(JSON.stringify(response));
    })
});

app.listen(3000);