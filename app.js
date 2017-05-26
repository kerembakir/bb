var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
	extended: true
}));

app.set('views', './views');
app.set('view engine', 'pug');


app.get('/', function(request, response) {
	response.render('index');
});


app.post('/create', function(request, response) {

	pg.connect(connectionString, function(err, client, done) {
		if (err) {
			done();
			throw err;
		}
		client.query('insert into messages (title, body) values ($1, $2)', [request.body.title, request.body.body], function(err, result) {
			if (err) {
				throw err;
			}

			done();
			pg.end();
			response.redirect('/messages');
		});
	});
});

app.get('/messages', function(request, response) {
	pg.connect(connectionString, function(err, client, done) {
		if (err) {
			done();
			throw err;
		}
		client.query('select * from messages', function(err, result) {
			messages = result.rows.reverse();
			response.render('messages', {
				messages: messages
			});
			done();
			pg.end();
		});
	});
});


app.listen(3000);
console.log('BB-App running on port 3000');
