const express       = require('express');
const cookieParser = require('cookie-parser')
const app           = express();
const bodyParser    = require('body-parser');
const path          = require('path');
const Database      = require('./database');

const db = new Database('mydb.db');

app.use(bodyParser.json());
app.use(cookieParser('1234'))
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', './views');
app.use('/static', express.static(path.resolve('static')));

const response = data => ({ message: data });

app.get('/', (req, res) => {
    res.cookie('hello world');
    return res.sendFile(path.resolve('views/index.html'))

});

app.get('/register', (req, res) => {
    return res.sendFile(path.resolve('views/register.html'));
});

app.post('/register', (req, res) => {

    let { username, password } = req.body;

    if (username && password) {
        return db.register(username, password)
            .then(()  => res.send(response('Successfully registered')))
            .catch(() => res.send(response('Something went wrong')));
    }

    return res.send(response('Missing parameters'));
});

app.get('/login', (req, res) => {
    return res.sendFile(path.resolve('views/login.html'));
});

app.post('/login', (req, res) => {
    let { username, password } = req.body;

    if (username && password) {
        console.log(username);
        return db.login(username, password)
            .then(() => res.redirect('/user'))
            .catch(() => res.send(response('Something went wrong')));
    }

    return res.send(response('Missing parameters'));
});


app.get('/user', (req, res) =>{
    res.sendFile(path.resolve('views/user.html'));
})



app.all('*', (req, res) => {
    return res.status(404).send({
        message: '404 page not found'
    });
});

(async () => {
    await db.connect();
    await db.migrate();

    app.listen(80, () => console.log('Listening on port http://127.0.0.1:80/'));
})();