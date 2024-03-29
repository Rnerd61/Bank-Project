const express       = require('express');
const cookieParser  = require('cookie-parser')
const session       = require('express-session')
const app           = express();
const bodyParser    = require('body-parser');
const routes        = require('./routes');
const path          = require('path');
const Database      = require('./database');

const db = new Database('weather-app.db');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', './views');
app.use('/static', express.static(path.resolve('static')));
app.use(cookieParser());
app.use(
    session({
        secret : 'ITS_A_SECRET',
        resave : false,
        saveUninitialized : false
    })
)

app.use(routes(db));

app.all('*', (req, res) => {
    return res.status(404).send({
        message: '404 page not found'
    });
});

(async () => {
    await db.connect();
    await db.migrate();

    app.listen(80, () => console.log('Listening on http://127.0.0.1/'));
})();