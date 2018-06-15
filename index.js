/* CONFIGURATION */

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
var cors = require('cors');
var mysql = require('mysql');
var url = require('url');
var bcrypt = require('bcryptjs');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

/* DATABASE CONNECTION */

var newcon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tmdb'
});


newcon.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected");
        newcon.query("CREATE DATABASE IF NOT EXISTS tmdb", function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("Database Created Successfully");
                con.connect(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Database Connected Successfully");
                        var sql = [
                            "CREATE TABLE IF NOT EXISTS users (uid INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), username VARCHAR(100), email VARCHAR(100), password VARCHAR(200))",
                            "CREATE TABLE IF NOT EXISTS profiles (uid VARCHAR(100) PRIMARY KEY, name VARCHAR(100), username VARCHAR(100), email VARCHAR(100), password VARCHAR(100))",
                            "CREATE TABLE IF NOT EXISTS feed (uid VARCHAR(100) PRIMARY KEY, name VARCHAR(100), username VARCHAR(100), email VARCHAR(100), password VARCHAR(100))"
                        ]

                        for (var i = 0; i <= 2; i++) {
                            con.query(sql[i], function (err, result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("TABLE CREATED SUCCESSFULLY");
                                }
                            });
                        }
                    }
                });

            }
        });
    }
});

/* MAIN APP  */

app.get('', function (req, res) {
    res.json("welcome to tmdb server");
});

app.post('', function (req, res) {
    res.json("welcome to tmdb server");
});

app.get('/users/auth/register', function (req, res) {
    var checkEmail = "SELECT * FROM users WHERE email= " + mysql.escape(req.query.email) + "";
    var checkUsername = "SELECT * FROM users WHERE username= " + mysql.escape(req.query.username) + "";
    con.query(checkEmail, function (err, result, fields) {
        if (err) {
            res.json(err);
        } else {
            if (result[0]) {
                res.json("This email is already registered");
            } else if(!result[0]) {
                con.query(checkUsername, function (err, usrresult, fields){
                    if (usrresult[0]) {
                        res.json("This username is already taken");
                    } else if(!usrresult[0]) {
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(req.query.password, salt, function (err, hash) {
                                var addUser = "INSERT INTO users (name, username, email, password) VALUES ('" + req.query.name + "', '" + req.query.username + "', '" + req.query.email + "', '" + hash + "')";
                                con.query(addUser, function (err, result) {
                                    if (err) {
                                        res.json(err);
                                    } else {
                                        res.json({ "response": true });
                                    }
                                });
                            });
                        });
                    } else {
                        res.json("There was an error");
                    }
                });
            } else {
                res.json("There was an error");
            }
        }
    });
});

app.post('/users/auth/register', function (req, res) {
    var checkEmail = "SELECT * FROM users WHERE email= " + mysql.escape(req.body.email) + "";
    var checkUsername = "SELECT * FROM users WHERE username= " + mysql.escape(req.body.username) + "";
    con.query(checkEmail, function (err, result, fields) {
        if (err) {
            res.json(err);
        } else {
            if (result[0]) {
                res.json("This email is already registered");
            } else if (!result[0]) {
                con.query(checkUsername, function (err, usrresult, fields) {
                    if (usrresult[0]) {
                        res.json("This username is already taken");
                    } else if (!usrresult[0]) {
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(req.body.password, salt, function (err, hash) {
                                var addUser = "INSERT INTO users (name, username, email, password) VALUES ('" + req.body.name + "', '" + req.body.username + "', '" + req.body.email + "', '" + hash + "')";
                                con.query(addUser, function (err, result) {
                                    if (err) {
                                        res.json(err);
                                    } else {
                                        res.json({ "response": true });
                                    }
                                });
                            });
                        });
                    } else {
                        res.json("There was an error");
                    }
                });
            } else {
                res.json("There was an error");
            }
        }
    });
});

app.get('/users/auth/login', function (req, res) {
    var getUser = "SELECT * FROM users WHERE email= " + mysql.escape(req.query.email) + "";
    con.query(getUser, function (err, result, fields) {
        if (err) {
            res.json(err);
        } else {

            if (result[0]) {
                data = result[0];
                hash = result[0].password;
                bcrypt.compare(req.query.password, hash, function (err, respwd) {
                    if (respwd === true) {
                        res.json({
                            status: "loggedin",
                            uid: data.uid,
                            name: data.name,
                            username: data.username,
                        });
                    } else if (respwd === false) {
                        res.json({
                            status: "wrongpassword",
                        });
                    } else {
                        res.json({
                            status: "tryagain",
                        });
                    }
                });
            } else {
                res.json({
                    status: "noaccountfound",
                });
            }
        }
    });
});

app.post('/users/auth/login', function (req, res) {
    var getUser = "SELECT * FROM users WHERE email= " + mysql.escape(req.body.email) + "";
    con.query(getUser, function (err, result, fields) {
        if (err) {
            res.json(err);
        } else {

            if (result[0]) {
                data = result[0];
                hash = result[0].password;
                bcrypt.compare(req.body.password, hash, function (err, respwd) {
                    if (respwd === true) {
                        res.json({
                            status: "loggedin",
                            uid: data.uid,
                            name: data.name,
                            username: data.username,
                        });
                    } else if (respwd === false) {
                        res.json({
                            status: "wrongpassword",
                        });
                    } else {
                        res.json({
                            status: "tryagain",
                        });
                    }
                });
            } else {
                res.json("No account found");
            }
        }
    });
});

app.get('/users/auth/resetpassword', function (req, res) {
    var getUser = "SELECT * FROM users WHERE email= " + mysql.escape(req.query.email) + "";
    con.query(getUser, function (err, result, fields) {
        if (err) {
            res.json(err);
        } else {

            if (result[0]) {
                hash = result[0].password;
                bcrypt.compare(req.query.oldpassword, hash, function (err, respwd) {
                    if (respwd === true) {
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(req.query.newpassword, salt, function (err, newhash) {
                                var updatePWD = "UPDATE users SET password = " + mysql.escape(newhash) + "";
                                con.query(updatePWD, function (err, result) {
                                    if (err) {
                                        res.json(err);
                                    } else {
                                        res.json("password updated");
                                    }
                                });
                            });
                        });
                    } else if (respwd === false) {
                        res.json("wrong password");
                    } else {

                    }
                });
            } else {
                res.json("No account found");
            }
        }
    });
});

app.post('/users/auth/resetpassword', function (req,res) {
    var getUser = "SELECT * FROM users WHERE email= " + mysql.escape(req.body.email) + "";
    con.query(getUser, function (err, result, fields) {
        if (err) {
            res.json(err);
        } else {

            if (result[0]) {
                hash = result[0].password;
                bcrypt.compare(req.body.oldpassword, hash, function (err, respwd) {
                    if (respwd === true) {
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(req.body.newpassword, salt, function (err, newhash) {
                                var updatePWD = "UPDATE users SET password = " + mysql.escape(newhash) + "";
                                con.query(updatePWD, function (err, result) {
                                    if (err) {
                                        res.json(err);
                                    } else {
                                        res.json("password updated");
                                    }
                                });
                            });
                        });
                    } else if (respwd === false) {
                        res.json("wrong password");
                    } else {

                    }
                });
            } else {
                res.json("No account found");
            }
        }
    });
});

app.get('*', function (req, res) {
    res.json({ "Error": "Cannot Find The Path Specified" });
});

app.post('*', function (req, res) {
    res.json({ "Error": "Cannot Find The Path Specified" });
});

/* APP PORT CONFIGURATION */
app.listen(process.env.PORT || 8080);