const jwt = require('jsonwebtoken');
const express = require('express');
const session = require('express-session');
const requests = require('requests');
const fs = require('fs')
const bodyParser = require('body-parser')

const ARGS = process.argv.splice(2).map(option => option.toLowerCase());
const IS_NO_AUTH = ARGS.includes('-noauth');
const FBJS_URL = 'http://172.16.3.159:420/';
const AUTH_URL = 'http://172.16.3.159:420/oauth';
const THIS_URL = 'http://localhost:3000/login';
const PORT = 3069;

// Create an Express App
const app = express();

// Allow express to use the 'public' folder
app.use(express.static('public'));

// Read JSON data from HTML POST requests
app.use(bodyParser.json());

// Use ejs to render html templates in 'views'
app.set('view engine', 'ejs');

// Store user session data
app.use(session({
    secret: 'ohnose!',
    resave: false,
    saveUninitialized: false
}))

// Load all user data
const data = JSON.parse(fs.readFileSync('data.json'));
let guestNum = 1;

// Middleware checks if user is logged in before continuing
function isAuthenticated(req, res, next) {
   if (req.session.user) {
        return next()
    } else {
        return res.redirect(`/login?redirectURL=${THIS_URL}`)
    }
};

// Root / homepage
app.get('/', isAuthenticated, (req, res) => {
    if (req.session.user) {
        let userData = {};
        if (req.session.user in data) {
            userData = data[req.session.user];
        }
        else {
            data[req.session.user] = { highscore: 0 };
            userData = data[req.session.user];
        }
        res.render('start', { user: userData });
    } else {
        res.redirect('/');
    }
});

app.get('/game', isAuthenticated, (req, res) => {
    if (req.session.user) {
        let userData = {};
        if (req.session.user in data) {
            userData = data[req.session.user];
        }
        else {
            data[req.session.user] = { highscore: 0 };
            userData = data[req.session.user];
        }
        res.render('game', { user: userData });
    } else {
        res.redirect('/');
    }
});

app.get('/howplay', isAuthenticated, (req, res) => {
    res.render('howplay');
});

app.get('/credits', isAuthenticated, (req, res) => {
    res.render('credits');
});

app.get('/leaderboards', isAuthenticated, (req, res) => {
    let leaders = [];
    // Put all players in a list
    for (const player of Object.keys(data)) {
        let newObj = {};
        newObj[player] = data[player].highscore;
        leaders.push(newObj);
    }
    // Sort by highscore
    leaders.sort((a, b) => a.highscore - b.highscore)
    res.render('leaders', { leaders: leaders });
});

app.post('/submiths', (req, res) => {
    if (req.session.user in data) {
        if (req.body.score > data[req.session.user].highscore)
            data[req.session.user] = { highscore: req.body.score };
    }
    else {
        data[req.session.user] = { highscore: req.body.score };
    }
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.json({ message: "accepted" });
});

// Collect login data from Formbar
app.get('/login', (req, res) => {
    if (IS_NO_AUTH) {
        req.session.user = `GUEST-${guestNum}`;
        res.redirect('/');
        return;
    }

    if (req.query.token) {
        let tokenData = jwt.decode(req.query.token);
        req.session.token = tokenData;
        req.session.user = tokenData.username;
        res.redirect('/');
    } else {
        res.redirect(`${AUTH_URL}?redirectURL=${THIS_URL}`);
    };
});

app.listen(PORT, (err) => {
    if (err) {
        console.error(err);
    }
});