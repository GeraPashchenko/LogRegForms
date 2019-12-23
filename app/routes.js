module.exports = function (app,connection, countriesList) {
//Routing
app.get('/', function (request, response) {
    response.render('index.ejs');
});

app.get('/signin', function (request, response) {
    response.render('login.ejs');
});

app.get('/signup', function (request, response) {
    
    response.render('registr.ejs',{countries : countriesList});
});

app.post('/auth', function (request, response) {
    var login = request.body.login;
    var password = request.body.password;

    if (login && password) {
        connection.query('SELECT * FROM users WHERE ((login = ? OR email = ?) AND password = ?)', [login, login, password], function (error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.login = login;
                response.redirect('/profile');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.post('/registr', function (request, response) {

    var email = request.body.email;
    var login = request.body.login;
    var real_name = request.body.real_name;
    var password = request.body.password;
    var birth_date = request.body.birth_date;
    var country = request.body.country;
    var password = request.body.password;

    var sql = 'INSERT INTO users(email,login,real_name,password,birth_date,country) VALUES("' + email + '","' + login + '","' + real_name + '","' + password + '","' + birth_date + '","' + country + '")'

    connection.query('SELECT * FROM users WHERE (login = ? OR email = ?)', [login, login], function (error, results, fields) {
        if (results.length === 0) {
            request.session.loggedin = true;
            request.session.login = login;

            connection.query(sql, function (err, results) {
                if (err) console.log(err);
                console.log(results);
            });
            response.redirect('/profile');
        } else {
            response.send('User is allready exists!');
        }
        response.end();
    });
});
app.get('/profile', function (req, res) {
    res.render('profile.ejs', { user: req.session.login });
});
app.get('/logout', function (req, res) {
    req.session.login = "";
    res.redirect('/');
})
app.get('/home', function (request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.login + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});
};