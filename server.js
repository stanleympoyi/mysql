var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
const path = require('path');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static(path.join(__dirname, '/public')))
app.set('views', path.join(__dirname, '/views'))

var handlebars = require('express-handlebars');
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('port', 4000);

app.get('/', function(req, res, next) {
    var context = {};
    mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields) {
        if (err) {
            next(err);
            return;
        }
        context.results = (rows);
        res.render('home', context);
    });
});

app.get('/insert', function(req, res, next) {
    var context = {};
    mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?,?,?,?,?)", [req.query['name'], req.query['reps'], req.query['weight'], req.query['date'], req.query['lbs']], function(err, result) {
        if (err) {
            next(err);
            return;
        }
        context.results = "Inserted id " + result.insertId;
        res.render('home', context);
    });
});

app.get('/delete', function(req, res, next) {
    var context = {};
    mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result) {
        if (err) {
            next(err);
            return;
        }
        context.results = "Deleted " + result.changedRows + " rows.";
        res.render('home', context);
    });
});

///safe-update?id=1&name=The+Task&done=false
app.get('/update', function(req, res, next) {
    var context = {};
    mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result) {
        if (err) {
            next(err);
            return;
        }
        if (result.length == 1) {
            var curVals = result[0];
            mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ", [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs],
                function(err, result) {
                    if (err) {
                        next(err);
                        return;
                    }
                    context.results = "Updated " + result.changedRows + " rows.";
                    res.render('home', context);
                });
        }
    });
});

app.get('/reset-table', function(req, res, next) {
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err) { //replace your connection pool with the your variable containing the connection pool
        var createString = "CREATE TABLE workouts(" +
            "id INT PRIMARY KEY AUTO_INCREMENT," +
            "name VARCHAR(255) NOT NULL," +
            "reps INT," +
            "weight INT," +
            "date DATE," +
            "lbs BOOLEAN)";
        mysql.pool.query(createString, function(err) {
            context.results = "Table reset";
            res.render('home', context);
        })
    });
});

app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});